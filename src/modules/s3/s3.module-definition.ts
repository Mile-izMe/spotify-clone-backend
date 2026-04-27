
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: S3ConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: S3_OPTIONS_TOKEN, 
    OPTIONS_TYPE: S3_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
