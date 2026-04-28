import {
    AbstractStepService, JobExtendedContext, ProcessMusicPayload
} from "@modules/bull"
import {
    JobActionService
} from "@modules/bussiness"
import {
    S3Provider
} from "@modules/s3/enums"
import {
    S3ReadService
} from "@modules/s3/s3-read.service"
import {
    Injectable
} from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import {
    pipeline
} from "stream/promises"
import {
    ExtendedProcessMusicContext
} from "../types"

@Injectable()
export class ProcessMusicDownloadStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
        private readonly jobActionService: JobActionService,
        private readonly s3ReadService: S3ReadService,
    ) {
        super()
    }

    stepIndex = 0

    stepName = "download"

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
            throw new Error("localTempPath is not defined in context")
        }
        
        try {
            // 1. Create parent directory if it doesn't exist (in case Worker hasn't created it yet)
            const folder = path.dirname(localTempPath)
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder,
                    {
                        recursive: true
                    })
            }

            // 2. Download file from S3 -> use Sream to avoid loading entire file into memory
            const readStream = await this.s3ReadService.stream({
                key: song.audioUrl,
                provider: S3Provider.Minio,
            })
            const writeStream = fs.createWriteStream(localTempPath)
            // Use pipeline to pipe safely data from MinIO -> Local Disk
            await pipeline(readStream,
                writeStream)

            // 3. Update Job Progress
            await this.jobActionService.increaseJob({
                job,
            })
        } catch (error) {
            throw new Error(`Download step failed: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
    