/** Params for process music job. */
export interface ProcessingMusicJobParams {
    /** The ID of the user to process. */
    userId: string
    /** The ID of the song to process. */
    songId: string
    /** The ID of the job to requeue. */
    jobId?: string
}
