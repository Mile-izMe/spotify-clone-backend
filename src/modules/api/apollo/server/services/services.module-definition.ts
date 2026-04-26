import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

/** Dynamic module definition for ServicesModule. */
export const { 
    ConfigurableModuleClass: ServicesModuleClass,
    MODULE_OPTIONS_TOKEN: SERVICES_OPTIONS_TOKEN,
    OPTIONS_TYPE: SERVICES_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .setExtras(
            {
                isGlobal: false,
            },
            (definition, extras) => ({
                ...definition,
                global: extras.isGlobal,
            }),
        )
        .build()
