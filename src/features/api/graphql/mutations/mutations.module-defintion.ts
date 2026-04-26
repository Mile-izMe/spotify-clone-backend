import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: MutationConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: MUTATION_OPTIONS_TOKEN, 
    OPTIONS_TYPE: MUTATION_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
