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
    S3WriteService
} from "@modules/s3/s3-write.service"
import {
    Injectable
} from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import {
    ExtendedProcessMusicContext
} from "../types"

@Injectable()
export class ProcessMusicUploadStepService extends AbstractStepService<
    ProcessMusicPayload,
    ExtendedProcessMusicContext
> {
    constructor(
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
            // 1. Read all files in directory output recursively (m3u8 & ts)
            const files = this.collectFilesRecursively(outputDir)

            // 2. Upload each file to S3
            // Use Promise.all if small quantity of files, 
            // But for HLS (a hundred files), upload concurrency or limit concurrency
            for (const fileName of files) {
                const filePath = path.join(outputDir,
                    fileName)
                const fileStream = fs.createReadStream(filePath)
                
                // Structure S3 Key: processed/songs/{songId}/{fileName}
                const s3Key = `processed/songs/${song.id}/${fileName.replace(/\\/g,
                    "/")}`

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

    private collectFilesRecursively(dirPath: string, relativePath = ""): Array<string> {
        const currentPath = relativePath
            ? path.join(dirPath,
                relativePath)
            : dirPath

        const entries = fs.readdirSync(currentPath,
            {
                withFileTypes: true,
            })

        const files: Array<string> = []

        for (const entry of entries) {
            const nextRelativePath = relativePath
                ? path.join(relativePath,
                    entry.name)
                : entry.name

            if (entry.isDirectory()) {
                files.push(...this.collectFilesRecursively(dirPath,
                    nextRelativePath))
                continue
            }

            files.push(nextRelativePath)
        }

        return files
    }
}
    