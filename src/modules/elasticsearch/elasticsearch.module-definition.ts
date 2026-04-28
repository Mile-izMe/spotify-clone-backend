
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: ElasticsearchConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: ELASTICSEARCH_OPTIONS_TOKEN, 
    OPTIONS_TYPE: ELASTICSEARCH_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
