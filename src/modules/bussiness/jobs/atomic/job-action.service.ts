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

/**
 * Service for job lifecycle management using Prisma.
 */
@Injectable()
export class JobActionService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

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

    async createJob(
        {
            id,
            actionType,
            payload,
            maxStep = 1,
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
