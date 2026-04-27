import {
    JobActionService,
    JobStalledService
} from "../atomic"
import {
    Injectable,
} from "@nestjs/common"
import {
    Job,
} from "@prisma/client"
import {
    v4 as uuidv4
} from "uuid"
import {
    Queue
} from "bullmq"
import {
    InjectQueue
} from "@nestjs/bullmq"
import {
    bullData,
    BullQueueName
} from "@modules/bull"
import {
    ProcessingMusicJobParams
} from "../types"
import type {
    ProcessMusicPayload,
} from "@modules/bull"
import {
    envConfig 
} from "@modules/env/config"

/**
 * Service for enqueuing a process music job.
 */
@Injectable()
export class EnqueueProcessMusicJobService {
    constructor(
        private readonly jobActionService: JobActionService,
        private readonly jobStalledService: JobStalledService,
        @InjectQueue(bullData[BullQueueName.ProcessMusic].name)
        private readonly processMusicQueue: Queue<ProcessMusicPayload>,
    ) { }

    /**
     * Enqueue a process music job.
     * @param params - The parameters for enqueuing a process music job.
     * @param params.userId - The ID of the user.
     * @param params.songId - The ID of the song to process.
     * @param params.jobId - The ID of the job to requeue.
     * @returns The job.
     */
    async enqueue(
        {
            userId,
            songId,
            jobId,
        }: ProcessingMusicJobParams,
    ): Promise<Job> {
        // get the job record
        let job: Job | null = null
        if (jobId) {
            // requeue the job
            job = await this.jobStalledService.requeueJob(
                {
                    id: jobId,
                }
            )
        } else {
            // create a new job record
            job = await this.jobActionService.createJob({
                id: uuidv4(),
                userId,
                actionType: BullQueueName.ProcessMusic,
                maxStep: envConfig().job.processMusic.maxSteps,
                payload: {
                    userId,
                    songId,
                },
            })
        }

        // push the job to the queue
        await this.processMusicQueue.add(
            job.id,
            {
                userId,
                songId,
            },
            {
                jobId: job.id,
            }
        )

        return job
    }
}