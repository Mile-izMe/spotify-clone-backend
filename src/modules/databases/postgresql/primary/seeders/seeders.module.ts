import {
    DynamicModule,
    Module,
} from "@nestjs/common"
import {
    SeedersService,
} from "./seeders.service"
import {
    ConfigurableModuleClass,
    OPTIONS_TYPE,
} from "./seeders.module-definition"

/**
 * Module for the Seeders.
 */
@Module({
})
export class SeedersModule extends ConfigurableModuleClass {
    static register(options: typeof OPTIONS_TYPE): DynamicModule {
        const providers = []
        const dynamicModule = super.register(options)
        return {
            ...dynamicModule,
            providers: [
                ...dynamicModule.providers ?? [],
                ...providers,
                SeedersService
            ],
            exports: [
                ...providers,
            ],
        }
    }
}
