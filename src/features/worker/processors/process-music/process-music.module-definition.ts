import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: ProcessMusicConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: PROCESS_MUSIC_OPTIONS_TOKEN, 
    OPTIONS_TYPE: PROCESS_MUSIC_OPTIONS_TYPE
} =
    new ConfigurableModuleBuilder()
        .build()
