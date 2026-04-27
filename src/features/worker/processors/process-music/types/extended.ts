import {
    Song,
    User
} from "@prisma/client"

/** Extended context for the process-music pipeline. */
export interface ExtendedProcessMusicContext {
    /** The song being processed. */
    song: Song
    /** The user who submitted the music. */
    user: User
    /**
     * Temp path in Disk (local path) to store file in processing.
     * Step 1 (Download) will fill this, Step 2 & 3 will use it.
     */
    localTempPath?: string;
    
    /**
     * Directory containing HLS files after transcoding
     * Step 3 fills this, Step 4 uses it for upload.
     */
    outputDir?: string;

    /** Metadata collected after analysis (Duration, Bitrate...) */
    metadata?: Record<string, unknown>;
}
