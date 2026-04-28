import {
    AbstractStepService, JobExtendedContext, ProcessMusicPayload
} from "@modules/bull"
import {
    JobActionService
} from "@modules/bussiness"
import {
    FfmpegService
} from "@modules/ffmpeg/ffmpeg.service"
import {
    Injectable
} from "@nestjs/common"
import {
    ExtendedProcessMusicContext
} from "../types"

@Injectable()
export class ProcessMusicTranscodeStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
        private readonly jobActionService: JobActionService,
        private readonly ffmpegService: FfmpegService,
    ) {
        super()
    }

    stepIndex = 2

    stepName = "transcode"

    /**
     * Process the step.
     * @param context - The context of the step.
     * @returns A promise that resolves when the step is processed.
     */
    async process(
        context: JobExtendedContext<
            ProcessMusicPayload,
            ExtendedProcessMusicContext
        >
    ): Promise<void> {
        const {
            localTempPath, outputDir 
        } = context.extended
        const { job } = context
        if (!localTempPath || !outputDir) {
            throw new Error("Missing localTempPath or outputDir in context")
        }
        try {
            // 1. Call FfmpegService to convert to HLS
            // Await until 100%
            await this.ffmpegService.convertToHlsNew(localTempPath,
                outputDir)

            // 2. Update Job Progress
            await this.jobActionService.increaseJob({
                job,
            })
        } catch (error) {
            throw new Error(`Transcode step failed: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
    