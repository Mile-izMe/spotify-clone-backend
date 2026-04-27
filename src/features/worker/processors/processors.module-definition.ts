import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: ProcessorsConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: PROCESSORS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: PROCESSORS_OPTIONS_TYPE
} =
    new ConfigurableModuleBuilder()
        .build()
