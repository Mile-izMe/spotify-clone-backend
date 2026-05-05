
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: HashConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: HASH_OPTIONS_TOKEN, 
    OPTIONS_TYPE: HASH_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
