import {
    Injectable, Logger 
} from "@nestjs/common"
import ffmpeg from "fluent-ffmpeg"
import * as path from "path"
import * as fs from "fs"

@Injectable()
export class FfmpegService {
    private readonly logger = new Logger(FfmpegService.name)
    private readonly audioBitrates = ["64k",
        "96k",
        "128k",
        "192k"]

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
        return this.convertToHlsNew(inputPath,
            outputDir)
    }

    async convertToHlsNew(inputPath: string, outputDir: string): Promise<string> {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir,
                {
                    recursive: true 
                })
        }

        const variants = this.audioBitrates.map((bitrate) => ({
            bitrate,
            bandwidth: this.bitrateToBandwidth(bitrate),
        }))

        for (const variant of variants) {
            const variantDir = path.join(outputDir,
                variant.bitrate)
            if (!fs.existsSync(variantDir)) {
                fs.mkdirSync(variantDir,
                    {
                        recursive: true 
                    })
            }

            const playlistPath = path.join(variantDir,
                "playlist.m3u8")
            await this.transcodeVariant({
                inputPath,
                outputPath: playlistPath,
                outputDir: variantDir,
                bitrate: variant.bitrate,
            })
        }

        const masterPlaylistPath = path.join(outputDir,
            "master.m3u8")
        const masterPlaylist = this.buildMasterPlaylist(variants)
        fs.writeFileSync(masterPlaylistPath,
            masterPlaylist,
            "utf8")

        return masterPlaylistPath
    }

    private async transcodeVariant(params: {
        inputPath: string
        outputPath: string
        outputDir: string
        bitrate: string
    }): Promise<void> {
        const {
            inputPath,
            outputPath,
            outputDir,
            bitrate,
        } = params

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    "-c:a aac",
                    `-b:a ${bitrate}`,
                    "-vn",
                    "-ac 2",
                    "-ar 44100",
                    "-hls_time 6",
                    "-hls_playlist_type vod",
                    "-hls_list_size 0",
                    "-hls_segment_filename",
                    path.join(outputDir,
                        "seg_%03d.ts"),
                ])
                .on("start",
                    (command) => this.logger.log(`Spawned FFmpeg (${bitrate}) with command: ${command}`))
                .on("progress",
                    (progress) => {
                        if (progress.percent) {
                            this.logger.debug(`Processing ${bitrate}: ${progress.percent.toFixed(2)}% done`)
                        }
                    })
                .on("error",
                    (err) => {
                        this.logger.error(`Error transcoding ${bitrate}: ${err.message}`)
                        reject(err)
                    })
                .on("end",
                    () => {
                        this.logger.log(`Transcoding finished for ${bitrate}!`)
                        resolve()
                    })
                .save(outputPath)
        })
    }

    private buildMasterPlaylist(variants: Array<{ bitrate: string; bandwidth: number }>): string {
        const lines = [
            "#EXTM3U",
            "#EXT-X-VERSION:3",
        ]

        for (const variant of variants) {
            lines.push(
                `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},CODECS="mp4a.40.2"`,
                `${variant.bitrate}/playlist.m3u8`,
            )
        }

        return `${lines.join("\n")}\n`
    }

    private bitrateToBandwidth(bitrate: string): number {
        const numeric = Number.parseInt(bitrate.replace(/[^0-9]/g,
            ""),
        10)
        return Number.isFinite(numeric)
            ? numeric * 1000
            : 192000
    }
}