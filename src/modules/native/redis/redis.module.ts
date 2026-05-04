import {
    DynamicModule, Module 
} from "@nestjs/common"
import {
    RedisConfigurableModuleClass, 
    REDIS_OPTIONS_TYPE 
} from "./redis.module-definition"
import {
    createRedisProvider 
} from "./redis.providers"
import {
    RedisService,
} from "./redis.service"

@Module({
})
export class RedisModule extends RedisConfigurableModuleClass {
    static register(options: typeof REDIS_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const {
            instanceKeys 
        } = options
        const providers = instanceKeys.map(
            instanceKey =>
                createRedisProvider(instanceKey)
        )
        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers || []),
                ...providers,
                RedisService,
            ],
            exports: [
                ...providers,
                RedisService,
            ],
        }
    }
}
