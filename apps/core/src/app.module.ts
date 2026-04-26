import {
    PrismaModule 
} from "@modules/databases/prisma"
import {
    EnvModule
} from "@modules/env"
import {
    MixinModule 
} from "@modules/mixin/mixin.module"
import {
    Module
} from "@nestjs/common"
import {
    ValidationPipe 
} from "@nestjs/common"
import {
    APP_PIPE 
} from "@nestjs/core"
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
            // CqrsModule.forRoot(),
            // CQRSModule.register({
            //     isGlobal: true,
            // }),
            // /** Jwt module. */
            // JwtModule.register({
            //     global: true,
            // }),
            // /** S3 module. */
            // S3Module.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** BullMQ module. */
            // BullModule.forRoot(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            /** Prisma module. */
            PrismaModule.register(
                {
                    isGlobal: true,
                }
            ),
            // /** Bussiness module. */
            // BussinessModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** IoRedis module. */
            // RedisModule.register(
            //     {
            //         instanceKeys: [
            //             RedisInstanceKey.Adapter,
            //             RedisInstanceKey.Cache,
            //         ],
            //         isGlobal: true,
            //     }
            // ),
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
            // ApiModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
            // /** Worker module. */
            // WorkerModule.register(
            //     {
            //         isGlobal: true,
            //     }
            // ),
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
export class AppModule { }
