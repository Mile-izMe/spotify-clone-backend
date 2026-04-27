
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: FfmpegConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: FFMPEG_OPTIONS_TOKEN, 
    OPTIONS_TYPE: FFMPEG_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
