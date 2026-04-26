import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: GraphqlConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: GRAPHQL_OPTIONS_TOKEN, 
    OPTIONS_TYPE: GRAPHQL_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
