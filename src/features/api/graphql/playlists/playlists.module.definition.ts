import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: PlaylistsConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PLAYLISTS_OPTIONS_TOKEN,
    OPTIONS_TYPE: PLAYLISTS_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
