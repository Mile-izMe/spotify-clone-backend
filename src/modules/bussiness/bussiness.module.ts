import {
    Module,
    DynamicModule,
} from "@nestjs/common"
import {
    BussinessConfigurableModuleClass,
    BUSINESS_OPTIONS_TYPE,
} from "./bussiness.module-definition"
import {
    JobsModule 
} from "./jobs"

/**
 * The module for the bussiness logics.
 */
@Module({
})
export class BussinessModule extends BussinessConfigurableModuleClass {
    static register(options: typeof BUSINESS_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const modules: Array<DynamicModule> = [JobsModule.register(options)]

        return {
            ...dynamicModule,
            imports: [
                ...modules,
            ],
            providers: [
                ...(dynamicModule.providers ?? []),
            ],
            exports: [
                ...modules,
            ],
        }
    }
}