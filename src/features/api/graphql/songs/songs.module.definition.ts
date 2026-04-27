import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: SongsConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: SONGS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: SONGS_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
