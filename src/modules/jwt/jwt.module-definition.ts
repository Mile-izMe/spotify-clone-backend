
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: JwtConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: JWT_OPTIONS_TOKEN, 
    OPTIONS_TYPE: JWT_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
