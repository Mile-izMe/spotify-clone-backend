import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: MutationsConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PLAYLIST_MUTATIONS_OPTIONS_TOKEN,
    OPTIONS_TYPE: PLAYLIST_MUTATIONS_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
