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

const AUDITED_MODELS = new Set([
    "User",
    "Role",
    "Permission",
    "RefreshToken",
    "Song",
    "Playlist",
])


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Expose the raw Prisma client for advanced use cases (type-safe)
    private _extendedClient

    constructor(private readonly requestContext: RequestContextService) {
        super({
            adapter: new PrismaPg({
                connectionString: envConfig().databases.postgresql.primary.url,
            }),
        })

        this._extendedClient = this.createExtendedClient()
    }

    private createExtendedClient() {
        return this.$extends({
            query: {
                $allModels: {
                    $allOperations: async ({
                        model,
                        operation,
                        args,
                        query 
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
                        const hasAuditFields = model ? AUDITED_MODELS.has(model) : false

                        if (username && hasAuditFields) {
                            const prismaArgs = args as PrismaArgsWithData
                            // CREATE
                            if (operation === "create" || operation === "createMany") {
                                if (prismaArgs.data) {
                                    if (Array.isArray(prismaArgs.data)) {
                                        // createMany: data is an array
                                        prismaArgs.data.forEach((item) => {
                                            item.createdBy = item.createdBy ?? username
                                            item.updatedBy = item.updatedBy ?? username
                                        })
                                    } else {
                                        // create: data is an object
                                        prismaArgs.data.createdBy = prismaArgs.data.createdBy ?? username
                                        prismaArgs.data.updatedBy = prismaArgs.data.updatedBy ?? username
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
                                    updateData.updatedBy = username
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
    }

    async onModuleInit() {
        Object.assign(this, this._extendedClient)
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}