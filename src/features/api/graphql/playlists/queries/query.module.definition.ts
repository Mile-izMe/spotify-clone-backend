import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: QueriesConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PLAYLIST_QUERIES_OPTIONS_TOKEN,
    OPTIONS_TYPE: PLAYLIST_QUERIES_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
