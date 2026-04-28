import {
    Injectable, Logger 
} from "@nestjs/common"
import ffmpeg from "fluent-ffmpeg"
import * as path from "path"
import * as fs from "fs"

@Injectable()
export class FfmpegService {
    private readonly logger = new Logger(FfmpegService.name)

    /**
   * Get Metadata of song (Duration, Bitrate...)
   */
    async getMetadata(inputPath: string): Promise<ffmpeg.FfprobeData> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath,
                (err, metadata) => {
                    if (err) reject(err)
                    resolve(metadata)
                })
        })
    }

    /**
   * Transcode file into HLS format (.m3u8) to support Adaptive Streaming -> For media
   */
    async convertToHls(inputPath: string, outputDir: string): Promise<string> {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir,
                {
                    recursive: true 
                })
        }

        const outputFileName = "playlist.m3u8"
        const outputPath = path.join(outputDir,
            outputFileName)

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    "-profile:v main",
                    "-crf 20",
                    "-g 48",
                    "-keyint_min 48",
                    "-sc_threshold 0",
                    "-hls_time 10",           // Split each segment into 10 seconds
                    "-hls_playlist_type vod",
                    "-hls_segment_filename",
                    path.join(outputDir,
                        "seg_%03d.ts"), // Mini file .ts
                ])
                .on("start",
                    (command) => this.logger.log(`Spawned FFmpeg with command: ${command}`))
                .on("progress",
                    (progress) => this.logger.debug(`Processing: ${progress.percent}% done`))
                .on("error",
                    (err) => {
                        this.logger.error(`Error transcoding: ${err.message}`)
                        reject(err)
                    })
                .on("end",
                    () => {
                        this.logger.log("Transcoding finished!")
                        resolve(outputPath)
                    })
                .save(outputPath)
        })
    }

    async convertToHlsNew(inputPath: string, outputDir: string): Promise<string> {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir,
                {
                    recursive: true 
                })
        }

        const outputFileName = "playlist.m3u8"
        const outputPath = path.join(outputDir,
            outputFileName)

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    "-c:a aac",            // Encode sang chuẩn AAC (chuẩn cho HLS)
                    "-b:a 192k",           // Bitrate âm thanh
                    "-vn",                 // QUAN TRỌNG: Loại bỏ video (Disable video) vì đây là file nhạc
                    "-hls_time 10",        // Chia mỗi segment 10 giây
                    "-hls_playlist_type vod",
                    "-hls_list_size 0",    // Giữ lại toàn bộ các segment trong playlist
                    "-hls_segment_filename",
                    path.join(outputDir,
                        "seg_%03d.ts"),
                ])
                .on("start",
                    (command) => this.logger.log(`Spawned FFmpeg with command: ${command}`))
                .on("progress",
                    (progress) => {
                        if (progress.percent) {
                            this.logger.debug(`Processing: ${progress.percent.toFixed(2)}% done`)
                        }
                    })
                .on("error",
                    (err) => {
                        this.logger.error(`Error transcoding: ${err.message}`)
                        reject(err)
                    })
                .on("end",
                    () => {
                        this.logger.log("Transcoding finished!")
                        resolve(outputPath)
                    })
                .save(outputPath)
        })
    }
}