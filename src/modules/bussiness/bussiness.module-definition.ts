
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: BussinessConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: BUSINESS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: BUSINESS_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
