import {
    Job,
    JobStatus,
    Prisma,
} from "@prisma/client"


/** Target selector for an existing job record. */
export interface JobTargetParams {
    /** The job entity. */
    job: Job
}

/** Params for creating a job tracking record. */
export interface CreateJobParams {
    /** The ID of the job. */
    id?: string
    /** The type of action to perform. */
    actionType: string
    /** The payload for the job. */
    payload: Prisma.InputJsonValue
    /** The maximum number of steps for the job. */
    maxStep?: number
    /** User this job is associated with. */
    userId: string
}

/** Params for getting a job. */
export interface GetJobParams {
    /** The ID of the job. */
    id: string
}

/** Params for queuing a job. */
export interface RequeueJobParams {
    /** The ID of the job. */
    id: string
}

/** Params for increasing the current step of a job. */
export interface IncreaseJobParams extends JobTargetParams {
    /** The step to increase. */
    step?: number
}

/** Params for marking a job as completed. */
export type CompleteJobParams = JobTargetParams

/** Params for marking a job as failed. */
export interface FailJobParams extends JobTargetParams {
    /** The error message. */
    error?: string
}

/** Params for querying stalled jobs. */
export interface GetStalledJobsParams {
    /** Optional action type to filter by. */
    actionType?: string
}

/** Result for querying stalled jobs. */
export type GetStalledJobsResult = Array<Job>

/** Params for updating the status of a job. */
export interface ProcessingJobParams extends JobTargetParams {
    /** Optional status to apply instead of PROCESSING. */
    status?: JobStatus
}