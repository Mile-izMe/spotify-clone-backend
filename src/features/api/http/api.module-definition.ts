import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: ApiConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: API_OPTIONS_TOKEN, 
    OPTIONS_TYPE: API_OPTIONS_TYPE 
} = 
    new ConfigurableModuleBuilder().build()
