import {
    BullQueueName,
    JobExtendedContext,
    ProcessMusicPayload,
    bullData
} from "@modules/bull"
import {
    JobActionService,
} from "@modules/bussiness"
import {
    PrismaService,
} from "@modules/databases"
import {
    envConfig,
} from "@modules/env"
import {
    DayjsService,
    InjectSuperJson,
} from "@modules/mixin"
import {
    Processor as Worker,
    WorkerHost,
} from "@nestjs/bullmq"
import {
    Job as PrismaJob,
} from "@prisma/client"
import type {
    Job as BullMQJob,
} from "bullmq"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import SuperJSON from "superjson"
import {
    v4 as uuidv4
} from "uuid"
import {
    ProcessMusicStepMappingService
} from "./step-mapping.service"
import type {
    ExtendedProcessMusicContext,
} from "./types"

type ProcessMusicJobData = ProcessMusicPayload | string

/**
 * Worker: Process Music Submission → download → analyze → transcode → upload -> finalize.
 * Enqueued jobs must use `maxSteps` matching the pipeline (default `5`, see `JOB_PROCESS_MUSIC_SUBMISSION_MAX_STEPS`).
 */
@Worker(
    bullData[BullQueueName.ProcessMusic].name,
    {
        concurrency: envConfig().bullmq.concurrency,
        lockDuration: envConfig().bullmq.lockDuration,
        stalledInterval: envConfig().bullmq.stalledInterval,
        maxStalledCount: envConfig().bullmq.maxStalledCount,
    },
)
export class ProcessMusicWorker extends WorkerHost {
    constructor(
        private readonly jobActionService: JobActionService,
        @InjectSuperJson()
        private readonly superJson: SuperJSON,
        private readonly stepMappingService: ProcessMusicStepMappingService,
        private readonly dayjsService: DayjsService,
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    /**
     * Process the job.
     * @param bullmqJob - The bullmq job from BullMQ queue.
     * @returns A promise that resolves when the job is processed.
     */
    async process(bullmqJob: BullMQJob<ProcessMusicJobData>) {
        const startedAt = this.dayjsService.now()
        let payload: ProcessMusicPayload | undefined
        let job: PrismaJob | undefined
        let tempBaseDir
        try {
            // 1. Get & Update Job Status to PROCESSING
            job = await this.jobActionService.getJob(
                {
                    id: bullmqJob.id ?? "",
                },
            )
            await this.jobActionService.processingJob({
                job,
            })

            // 2. Parse Payload
            // BullMQ may deliver `data` as an object (when producer passed an object)
            // or as a string (if stored/stringified). Handle both cases.
            if (typeof bullmqJob.data === "string") {
                payload = this.superJson.parse<ProcessMusicPayload>(bullmqJob.data)
            } else {
                payload = bullmqJob.data as ProcessMusicPayload
            }
            const stepMap = this.stepMappingService.getStepMap()

            // 3. Fetch data for extended context
            const song = await this.prisma.song.findUnique({
                where: {
                    id: payload.songId,
                }
            })
            if (!song) {
                throw new Error(`Song not found: ${payload.songId}`)
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.userId,
                }
            })
            if (!user) {
                throw new Error(`User not found: ${payload.userId}`)
            }

            // 3.5 Init temporary paths (Unique for each Job)
            tempBaseDir = path.join(os.tmpdir(),
                "music-processing",
                bullmqJob.id ?? uuidv4())
            const localTempPath = path.join(tempBaseDir,
                "original_file") // Original file after download
            const outputDir = path.join(tempBaseDir,
                "hls_output") // Dir for playlist .m3u8

            // 4. Construct the context for the steps
            const context: JobExtendedContext<
                ProcessMusicPayload, 
                ExtendedProcessMusicContext
            > = {
                job,
                queueName: bullmqJob.queueName,
                payload,
                extended: {
                    song,
                    user,
                    localTempPath,
                    outputDir,
                },
            }

            // 5. Execute steps sequentially
            while (job.currentStep < job.maxStep) {
                // refresh the job record
                const syncedJob = await this.jobActionService.getJob(
                    {
                        id: job.id,
                    },
                )
                // update the job record
                job = syncedJob
                // update the context
                context.job = job
                // process the step
                await stepMap.get(syncedJob.currentStep)?.process(
                    context
                )
            }

            // 6. Complete the job
            await this.jobActionService.completeJob({
                job,
            })

            console.log("Successfully processed job",
                {
                    jobId: job.id,
                    queueName: bullmqJob.queueName,
                    payload,
                    durationMs: this.dayjsService.now().diff(this.dayjsService.from(startedAt)),
                })
        } catch (error: Error | unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.log("Failed to process job",
                {
                    jobId: job?.id ?? "",
                    queueName: bullmqJob.queueName,
                    payload,
                    error: errorMessage,
                    durationMs: this.dayjsService.now().diff(this.dayjsService.from(startedAt)),
                },
            )
            throw error
        } finally {
            // Dọn dẹp thư mục tạm dù thành công hay thất bại
            if (fs.existsSync(tempBaseDir)) {
                fs.rmSync(tempBaseDir,
                    {
                        recursive: true, force: true 
                    })
            }
        }
    }
}
