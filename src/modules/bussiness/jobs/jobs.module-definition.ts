import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: JobsConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: JOBS_MODULE_OPTIONS_TOKEN, 
    OPTIONS_TYPE: JOBS_MODULE_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras(
        {
            isGlobal: false,
        },
        (
            definition,
            extras,
        ) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    ).build()
