import {
    DynamicModule, Module 
} from "@nestjs/common"
import {
    IoRedisConfigurableModuleClass, 
    IOREDIS_OPTIONS_TYPE 
} from "./ioredis.module-definition"
import {
    createIoRedisProvider 
} from "./ioredis.providers"

@Module({
})
export class IoRedisModule extends IoRedisConfigurableModuleClass {
    static register(options: typeof IOREDIS_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const {
            instanceKeys 
        } = options
        const providers = instanceKeys.map(instanceKey =>
            createIoRedisProvider(instanceKey)
        )
        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers || []),
                ...providers,
            ],
            exports: [
                ...providers,
            ],
        }
    }
}