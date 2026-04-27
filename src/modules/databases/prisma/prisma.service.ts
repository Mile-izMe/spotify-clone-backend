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


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            adapter: new PrismaPg({
                connectionString: envConfig().databases.postgresql.primary.url,
            }),
        })
    }

    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}