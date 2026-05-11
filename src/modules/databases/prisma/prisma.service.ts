import {
    PrismaPg
} from "@prisma/adapter-pg"
import {
    envConfig
} from "@modules/env"
import {
    Injectable, OnModuleInit, OnModuleDestroy 
} from "@nestjs/common"
import {
    PrismaClient 
} from "@prisma/client"
import {
    RequestContextService 
} from "@modules/context/request-context.service"
import {
    PrismaArgsWithData 
} from "./types"


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Expose the raw Prisma client for advanced use cases (type-safe)
    readonly extendedClient

    constructor(private readonly requestContext: RequestContextService) {
        super({
            adapter: new PrismaPg({
                connectionString: envConfig().databases.postgresql.primary.url,
            }),
        })

        // Prisma middleware: automatically set createBy / updateBy if available in request context
        this.extendedClient = this.$extends({
            query: {
                $allModels: {
                    $allOperations: async ({
                        model, operation, args, query 
                    }) => {
                        const user = this.requestContext.getUser()
                        const username = user?.username

                        if (username) {
                            const prismaArgs = args as PrismaArgsWithData
                            // CREATE
                            if (operation === "create" || operation === "createMany") {
                                if (prismaArgs.data) {
                                    if (Array.isArray(prismaArgs.data)) {
                                        // createMany: data là một mảng
                                        prismaArgs.data.forEach((item) => {
                                            if ("createBy" in item && !item.createBy) item.createBy = username
                                            if ("updateBy" in item && !item.updateBy) item.updateBy = username
                                        })
                                    } else {
                                        // create: data là một object
                                        if ("createBy" in prismaArgs.data && !prismaArgs.data.createBy) prismaArgs.data.createBy = username
                                        if ("updateBy" in prismaArgs.data && !prismaArgs.data.updateBy) prismaArgs.data.updateBy = username
                                    }
                                }
                            }

                            // UPDATE
                            if (
                                operation === "update" || 
                                operation === "updateMany" || 
                                operation === "upsert"
                            ) {
                                const updateData = operation === "upsert" ? prismaArgs.update : prismaArgs.data
                                
                                if (updateData && !Array.isArray(updateData)) {
                                    if ("updateBy" in updateData) {
                                        updateData.updateBy = username
                                    }
                                }
                            }
                        }
                        
                        console.debug(`Prisma Operation: ${operation} on ${model}`)
                        return query(args)
                    }
                }
            }
        })

        // Override method of PrismaClient by extended instance
        return this.extendedClient as unknown as PrismaService
    }

    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}