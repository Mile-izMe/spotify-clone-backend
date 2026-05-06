import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: UserConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: USER_OPTIONS_TOKEN,
    OPTIONS_TYPE: USER_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
