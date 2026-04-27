/**
 * Enum of BullMQ queue names used across the system.
 * Each name corresponds to a specific type of background job queue.
 */
export enum BullQueueName {
    /** Queue name for music processing jobs. */
    ProcessMusic = "process-music",
}
