import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: ContextModuleClass,
    MODULE_OPTIONS_TOKEN: CONTEXT_MODULE_OPTIONS_TOKEN,
    OPTIONS_TYPE: CONTEXT_MODULE_OPTIONS_TYPE
} = new ConfigurableModuleBuilder()
    .setExtras(
        {
            isGlobal: false
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    )
    .build()
