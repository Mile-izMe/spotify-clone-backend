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
import type {
    Job as BullMQJob,
} from "bullmq"
import {
    Job as PrismaJob,
} from "@prisma/client"
import SuperJSON from "superjson"
import {
    ProcessMusicStepMappingService
} from "./step-mapping.service"
import type {
    ExtendedProcessMusicContext,
} from "./types"

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
    async process(bullmqJob: BullMQJob<string>) {
        const startedAt = this.dayjsService.now()
        let payload: ProcessMusicPayload | undefined
        let job: PrismaJob | undefined
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
            payload = this.superJson.parse<ProcessMusicPayload>(bullmqJob.data)
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
        }
    }
}
