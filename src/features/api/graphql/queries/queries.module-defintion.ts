import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: QueriesConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: QUERIES_OPTIONS_TOKEN, 
    OPTIONS_TYPE: QUERIES_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
