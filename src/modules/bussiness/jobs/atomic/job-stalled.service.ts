import {
    Job,
    JobStatus,
} from "@prisma/client"
import {
    envConfig,
} from "@modules/env"
import {
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import type {
    GetStalledJobsParams,
    GetStalledJobsResult,
    RequeueJobParams,
} from "../types"
import {
    PrismaService,
} from "@modules/databases"

/**
 * Service for querying stalled jobs based on queue time threshold.
 */
@Injectable()
export class JobStalledService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Get all jobs still processing but queued longer than `envConfig().job.stalled`.
     * @param params - The parameters.
     * @param params.entityManager - The entity manager.
     * @param params.actionType - The action type to filter by.
     * @returns Stalled jobs.
     */
    async getStalledJobs(
        {
            actionType,
        }: GetStalledJobsParams
    ): Promise<GetStalledJobsResult> {
        const staleBefore = new Date(Date.now() - envConfig().job.stalled.thresholdMs)

        return this.prisma.job.findMany({
            where: {
                status: {
                    in: [
                        JobStatus.PENDING,
                        JobStatus.PROCESSING,
                    ],
                },
                updatedAt: {
                    lt: staleBefore,
                },
                ...(actionType ? {
                    actionType,
                } : {
                }),
            },
        })
    }

    /**
     * Requeue a job.
     * @param params - The parameters.
     * @param params.id - The ID of the job.
     * @param params.entityManager - The entity manager.
     * @returns The job.
     */
    async requeueJob(
        {
            id,
        }: RequeueJobParams
    ): Promise<Job> {
        const job = await this.prisma.job.findUnique({
            where: {
                id,
            },
        })

        if (!job) {
            throw new NotFoundException(`Job ${id} not found`)
        }

        return this.prisma.job.update({
            where: {
                id,
            },
            data: {
                status: JobStatus.PENDING,
                errorMessage: null,
            },
        })
    }
}
