import {
    DynamicModule,
    Module,
    Provider
} from "@nestjs/common"
import {
    MixinConfigurableModuleClass,
    MIXIN_OPTIONS_TYPE
} from "./mixin.module-defintion"
import {
    ReadinessWatcherFactoryService
} from "./readiness-watcher-factory.service"
import {
    AsyncService 
} from "./async.service"
import {
    RetryService 
} from "./retry.service"
import {
    createSuperJsonServiceProvider 
} from "./superjson.providers"

/**
 * Module for the Mixin service.
 */
@Module({
})
export class MixinModule extends MixinConfigurableModuleClass {
    /**
     * Register the Mixin module.
     * @param options - The options for the Mixin module.
     * @returns The DynamicModule for the Mixin module.
     */
    static register(options: typeof MIXIN_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const providers: Array<Provider> = [
            ReadinessWatcherFactoryService,
            AsyncService,
            RetryService,
            createSuperJsonServiceProvider(),
        ]
        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers ?? []),
                ...providers,
            ],
            exports: [...providers],
        }
    }
}