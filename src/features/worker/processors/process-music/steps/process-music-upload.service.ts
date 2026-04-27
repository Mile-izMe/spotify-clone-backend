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
    S3WriteService 
} from "@modules/s3/s3-write.service"
import {
    Injectable
} from "@nestjs/common"
import {
    ExtendedProcessMusicContext
} from "../types"
import * as fs from "fs"
import * as path from "path"
import {
    S3Provider 
} from "@modules/s3/enums"

@Injectable()
export class ProcessMusicUploadStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jobActionService: JobActionService,
        private readonly s3WriteService: S3WriteService,
    ) {
        super()
    }

    stepIndex = 3

    stepName = "upload"

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
        const { song, outputDir } = context.extended
        const { job } = context

        if (!outputDir) {
            throw new Error("outputDir is not defined in context")
        }
        
        try {
            // 1. Read all files in directory output (m3u8 & ts)
            const files = fs.readdirSync(outputDir)

            // 2. Upload each file to S3
            // Use Promise.all if small quantity of files, 
            // But for HLS (a hundred files), upload concurrency or limit concurrency
            for (const fileName of files) {
                const filePath = path.join(outputDir,
                    fileName)
                const fileStream = fs.createReadStream(filePath)
                
                // Structure S3 Key: processed/songs/{songId}/{fileName}
                const s3Key = `processed/songs/${song.id}/${fileName}`

                const contentType = fileName.endsWith(".m3u8") 
                    ? "application/vnd.apple.mpegurl" 
                    : "video/MP2T"
                
                await this.s3WriteService.stream({
                    name: s3Key,
                    stream: fileStream,
                    provider: S3Provider.Minio,
                    // ContentType is important for HLS, especially for m3u8 file
                    contentType: contentType,
                    acl: "public-read",
                })
            }

            // 3. Update Job Progress
            await this.jobActionService.increaseJob({
                job,
            })
        } catch (error) {
            throw new Error(`Upload step failed: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
    