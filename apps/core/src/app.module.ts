import {
    ApiModule 
} from "@features/api"
import {
    WorkerModule 
} from "@features/worker"
import {
    BullModule 
} from "@modules/bull"
import {
    BussinessModule 
} from "@modules/bussiness"
import {
    CQRSModule 
} from "@modules/cqrs"
import {
    PrismaModule
} from "@modules/databases/prisma"
import {
    ElasticsearchModule 
} from "@modules/elasticsearch"
import {
    EnvModule
} from "@modules/env"
import {
    FfmpegModule 
} from "@modules/ffmpeg"
import {
    MixinModule
} from "@modules/mixin/mixin.module"
import {
    RedisInstanceKey, RedisModule 
} from "@modules/native"
import {
    S3Module
} from "@modules/s3"
import {
    Module,
    ValidationPipe
} from "@nestjs/common"
import {
    APP_PIPE
} from "@nestjs/core"
import {
    CqrsModule
} from "@nestjs/cqrs"
/**
 * The main module for the application.
 */
@Module(
    {
        imports: [
            /** Environment module. */
            EnvModule.forRoot(),
            /** Mixin module. */
            MixinModule.register({
                isGlobal: true,
            }),
            // /** Axios module. */
            // AxiosModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** Winston module. */
            // WinstonModule.register(
            //     {
            //         serviceName: ServiceName.Api,
            //         level: WinstonLevel.Verbose,
            //         isGlobal: true,
            //     }
            // ),
            // /** CQRS module. */
            CqrsModule.forRoot(),
            CQRSModule.register({
                isGlobal: true,
            }),
            // /** Jwt module. */
            // JwtModule.register({
            //     global: true,
            // }),
            // /** S3 module. */
            S3Module.register(
                {
                    isGlobal: true,
                }
            ),
            // /** BullMQ module. */
            BullModule.forRoot(
                {
                    isGlobal: true,
                }
            ),
            /** Prisma module. */
            PrismaModule.register(
                {
                    isGlobal: true,
                }
            ),
            // /** Bussiness module. */
            BussinessModule.register(
                {
                    isGlobal: true,
                }
            ),
            /** IoRedis module. */
            RedisModule.register(
                {
                    instanceKeys: [
                        RedisInstanceKey.Adapter,
                        RedisInstanceKey.Cache,
                    ],
                    isGlobal: true,
                }
            ),
            /** Elasticsearch module. */
            ElasticsearchModule.register(
                {
                    isGlobal: true,
                }
            ),
            // /** Throttler module. */
            // ThrottlerModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** Cdn Synchronizer module. */
            // CdnSynchronizerModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** Cache module. */
            // CacheModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** Event module. */
            // EventEmitterModule.forRoot(),
            // EventModule.register(
            //     {
            //         isGlobal: true,
            //         nats: {
            //             subjects: [
            //                 EventName.JobStatusUpdated,
            //             ],
            //         },
            //     }
            // ),
            // /** Api module. */
            ApiModule.register(
                {
                    isGlobal: true,
                }
            ),
            // /** Worker module. */
            WorkerModule.register(
                {
                    isGlobal: true,
                }
            ),
            // /** Ffmpeg module. */
            FfmpegModule.register(
                {
                    isGlobal: true,
                }
            )
            // /** Event Bus module. */
            // EventBusModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
        ],
        providers: [
            {
                provide: APP_PIPE,
                useClass: ValidationPipe,
            },
        ],
    }
)
export class AppModule {}
