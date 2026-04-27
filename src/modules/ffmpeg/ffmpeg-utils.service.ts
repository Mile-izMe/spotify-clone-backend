import {
    Injectable 
} from "@nestjs/common"
import * as path from "path"
import * as fs from "fs"
import * as os from "os"

@Injectable()
export class FfmpegUtilsService {
    /**
   * Create a separate temporary directory for each processing job
   */
    createTempDir(jobId: string): string {
        const tempDir = path.join(os.tmpdir(),
            "spotify-clone",
            jobId)
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir,
                {
                    recursive: true 
                })
        }
        return tempDir
    }

    /**
   * Clean up temporary directory after processing is done to free up disk space
   */
    cleanTempDir(dirPath: string): void {
        try {
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath,
                    {
                        recursive: true, force: true 
                    })
            }
        } catch (error) {
            console.error(`Failed to delete temp dir: ${dirPath}`,
                error)
        }
    }
}