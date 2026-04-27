import {
    Module 
} from "@nestjs/common"
import {
    FfmpegService 
} from "./ffmpeg.service"
import {
    FfmpegUtilsService 
} from "./ffmpeg-utils.service"
import {
    FfmpegConfigurableModuleClass 
} from "./ffmpeg.module-definition"

@Module({
    providers: [
        FfmpegService,
        FfmpegUtilsService
    ],
    exports: [
        FfmpegService,
        FfmpegUtilsService
    ],
})
export class FfmpegModule extends FfmpegConfigurableModuleClass {}