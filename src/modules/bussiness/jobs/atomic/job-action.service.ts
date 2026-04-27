import {
    Job,
    JobStatus,
} from "@prisma/client"
import {
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import {
    PrismaService,
} from "@modules/databases"
import type {
    CompleteJobParams,
    CreateJobParams,
    FailJobParams,
    GetJobParams,
    IncreaseJobParams,
    ProcessingJobParams,
} from "../types"
import {
    InjectSuperJson 
} from "@modules/mixin"
import SuperJSON from "superjson"

/**
 * Service for job lifecycle management using Prisma.
 */
@Injectable()
export class JobActionService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectSuperJson()
        private readonly superJson: SuperJSON,
    ) {}

    /**
     * Get the job.
     * @param id - The ID of the job.
     * @param entityManager - The entity manager.
     * @returns The job.
     */
    async getJob(
        {
            id,
        }: GetJobParams,
    ): Promise<Job> {
        const job = await this.prisma.job.findUnique({
            where: {
                id,
            },
        })

        if (!job) {
            throw new NotFoundException(`Job ${id} not found`)
        }

        return job
    }

    /**
     * Create a job.
     * @param queueName - The queue name.
     * @param bullmqJobId - The BullMQ job ID.
     * @param payload - The payload.
     * @param maxSteps - The maximum steps.
     * @param entityManager - The entity manager.
     * @returns The job.
     */
    async createJob(
        {
            id,
            actionType,
            payload,
            maxStep = 0,
            userId,
        }: CreateJobParams,
    ): Promise<Job> {
        return this.prisma.job.create({
            data: {
                ...(id ? {
                    id,
                } : {
                }),
                actionType,
                payload,
                status: JobStatus.PENDING,
                currentStep: 0,
                maxStep,
                userId,
            },
        })
    }

    /**
     * Increase the job step.
     * @param step - The step to increase.
     * @param entityManager - The entity manager.
     * @param job - The job entity.
     * @returns The job.
     */
    async increaseJob(
        {
            step = 1,
            job,
        }: IncreaseJobParams,
    ): Promise<Job> {
        return this.prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                currentStep: {
                    increment: step,
                },
            },
        })
    }

    /**
     * Complete the job.
     * @param entityManager - The entity manager.
     * @param id - The ID of the job.
     * @returns The job.
     */
    async completeJob(
        {
            job,
        }: CompleteJobParams,
    ): Promise<Job> {
        return this.prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: JobStatus.COMPLETED,
                currentStep: Math.max(job.currentStep,
                    job.maxStep),
                errorMessage: null,
            },
        })
    }

    /**
     * Fail the job.
     * @param error - The error.
     * @param entityManager - The entity manager.
     * @param id - The ID of the job.
     * @returns The job.
     */
    async failJob(
        {
            error,
            job,
        }: FailJobParams,
    ): Promise<Job> {
        return this.prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: JobStatus.FAILED,
                errorMessage: error ?? null,
            },
        })
    }

    /**
     * Update the job status to processing.
     * @param entityManager - The entity manager.
     * @param job - The job entity.
     * @returns The job.
     */
    async processingJob(
        {
            job,
            status,
        }: ProcessingJobParams,
    ): Promise<Job> {
        return this.prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: status ?? JobStatus.PROCESSING,
            },
        })
    }
}
