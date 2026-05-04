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
    Injectable
} from "@nestjs/common"
import {
    ExtendedProcessMusicContext
} from "../types"

@Injectable()
export class ProcessMusicFinalizeStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jobActionService: JobActionService,
    ) {
        super()
    }

    stepIndex = 4

    stepName = "finalize"

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
        const { song } = context.extended
        const { job } = context
        
        try {
            // 1. Restructure HLS to point to the master playlist file
            const hlsUrl = `processed/songs/${song.id}/master.m3u8`

            // 2. Update Song record in database with HLS URL.
            await this.prisma.song.update({
                where: {
                    id: song.id 
                },
                data: {
                    audioUrl: hlsUrl,
                },
            })

            // 3. Update Job Progress
            await this.jobActionService.increaseJob({
                job,
            })
        } catch (error) {
            throw new Error(`Finalize step failed: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
    