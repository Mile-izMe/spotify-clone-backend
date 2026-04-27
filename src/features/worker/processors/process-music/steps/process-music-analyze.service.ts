import {
    AbstractStepService, JobExtendedContext, ProcessMusicPayload
} from "@modules/bull"
import {
    JobActionService
} from "@modules/bussiness"
import {
    PrismaService
} from "@modules/databases"
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
export class ProcessMusicAnalyzeStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jobActionService: JobActionService,
        private readonly ffmpegService: FfmpegService,
    ) {
        super()
    }

    stepIndex = 1

    stepName = "analyze"

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
        const { song, localTempPath } = context.extended
        const { job } = context
        if (!localTempPath) {
            throw new Error("localTempPath is required for analysis")
        }
        try {
            // 1. Use ffprobe to get metadata
            const metadata = await this.ffmpegService.getMetadata(localTempPath)
            const duration = metadata.format.duration
            
            if (!duration) {
                throw new Error("Could not extract duration from file")
            }

            // 2. Update duration in the Song table in DB
            await this.prisma.song.update({
                where: {
                    id: song.id 
                },
                data: {
                    duration: Math.round(duration), 
                },
            })

            // 3. Save metadata into context for Step 3 (Transcoding)
            // May be useful for transcoding decisions (e.g. if the file is already in a good format, we might skip transcoding)
            context.extended.metadata = metadata as unknown as Record<string, unknown>

            // 4. Update Job Progress
            await this.jobActionService.increaseJob({
                job,
            })
        } catch (error) {
            throw new Error(`Analyze step failed: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
    