import type {
    Job,
} from "@prisma/client"

export interface JobContext<T> {
    payload: T
    queueName?: string
    job: Job
}

export interface JobExtendedContext<T, E> extends JobContext<T> {
    extended: E
}