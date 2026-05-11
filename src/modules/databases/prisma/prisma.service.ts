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

        // Prisma middleware: automatically set createdBy / updatedBy / deletedBy if available in request context
        this.extendedClient = this.$extends({
            query: {
                $allModels: {
                    $allOperations: async ({
                        operation, args, query 
                    }) => {
                        if (operation === "findMany") {
                            // Exclude soft-deleted records by default
                            args.where = {
                                ...args.where, deletedAt: null 
                            }
                            return query(args)
                        }
                        if (operation === "findFirst") {
                            args.where = {
                                ...args.where, deletedAt: null 
                            }
                            return query(args)
                        }


                        const user = this.requestContext.getUser()
                        const username = user?.id

                        if (username) {
                            const prismaArgs = args as PrismaArgsWithData
                            // CREATE
                            if (operation === "create" || operation === "createMany") {
                                if (prismaArgs.data) {
                                    if (Array.isArray(prismaArgs.data)) {
                                        // createMany: data là một mảng
                                        prismaArgs.data.forEach((item) => {
                                            if ("createdBy" in item && !item.createdBy) item.createdBy = username
                                            if ("updatedBy" in item && !item.updatedBy) item.updatedBy = username
                                        })
                                    } else {
                                        // create: data là một object
                                        if ("createdBy" in prismaArgs.data && !prismaArgs.data.createdBy) prismaArgs.data.createdBy = username
                                        if ("updatedBy" in prismaArgs.data && !prismaArgs.data.updatedBy) prismaArgs.data.updatedBy = username
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
                                    if ("updatedBy" in updateData) {
                                        updateData.updatedBy = username
                                    }
                                }
                            }

                            // DELETE
                            if (operation === "delete" || operation === "deleteMany") {
                                if (prismaArgs.data) {
                                    if (Array.isArray(prismaArgs.data)) {
                                        // deleteMany with data (soft delete)
                                        prismaArgs.data.forEach((item) => {
                                            if ("deletedBy" in item && !item.deletedBy) {
                                                item.deletedBy = username
                                                item.deletedAt = new Date()
                                            }
                                        })
                                    } else {
                                        // delete with data (soft delete)
                                        if ("deletedBy" in prismaArgs.data && !prismaArgs.data.deletedBy) {
                                            prismaArgs.data.deletedBy = username
                                            prismaArgs.data.deletedAt = new Date()
                                        }
                                    }
                                }
                            }
                        }

                        // console.debug(`Prisma Operation: ${operation} on ${model}`)
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