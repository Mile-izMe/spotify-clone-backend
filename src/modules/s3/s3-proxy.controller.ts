import {
    GetObjectCommand 
} from "@aws-sdk/client-s3"
import {
    Controller, Get, HttpException, HttpStatus, Param, Req, Res 
} from "@nestjs/common"
import type {
    Request, Response 
} from "express"
import type {
    Readable 
} from "node:stream"
import type {
    GetObjectCommandInput 
} from "@aws-sdk/client-s3"
import {
    Buffer 
} from "node:buffer"
import {
    S3Provider 
} from "./enums"
import {
    S3ClientService 
} from "./s3-client.service"
import {
    RedisService,
} from "@modules/native"
import {
    envConfig 
} from "@modules/env"

@Controller("s3/proxy")
export class S3ProxyController {
    constructor(
        private readonly s3ClientService: S3ClientService,
        private readonly redisService: RedisService,
    ) {}

    @Get("playlist/:songId")
    async getPlaylist(@Param("songId") songId: string, @Res() res: Response) {
        return this.sendPlaylist(songId,
            "master.m3u8",
            res)
    }

    @Get("playlist/:songId/*playlistPath")
    async getVariantPlaylist(
        @Param("songId") songId: string,
        @Param("playlistPath") playlistPathParam: string | string[],
        @Res() res: Response,
    ) {
        const playlistPath = Array.isArray(playlistPathParam)
            ? playlistPathParam.join("/")
            : playlistPathParam

        return this.sendPlaylist(songId,
            playlistPath,
            res)
    }

    private async sendPlaylist(songId: string, playlistPath: string, res: Response) {
        const { client, bucket } = this.s3ClientService.getS3Resources(S3Provider.Minio)
        // Try requested playlist path first. If not found and requested was
        // "master.m3u8", fall back to "playlist.m3u8" which some pipelines
        // or older workers may produce (see MinIO screenshot).
        const tryPaths = [playlistPath]
        if (playlistPath === "master.m3u8") {
            tryPaths.push("playlist.m3u8")
        }

        for (const p of tryPaths) {
            const key = `processed/songs/${songId}/${p}`
            try {
                const cmd = new GetObjectCommand({
                    Bucket: bucket,
                    Key: key,
                })
                const data = await client.send(cmd)

                if (!data.Body) {
                    throw new Error("NoBody")
                }

                const body = data.Body as Readable
                const rawPlaylist = await this.readStreamAsUtf8(body)
                const rewrittenPlaylist = this.rewritePlaylistForProxy(rawPlaylist,
                    songId)

                res.setHeader("content-type",
                    "application/vnd.apple.mpegurl")
                return res.send(rewrittenPlaylist)
            } catch (err: unknown) {
                // If key not found, try next candidate; otherwise rethrow
                if (err instanceof Error && err.name === "NoSuchKey") {
                    // continue to next attempt
                    continue
                }
                // For other errors, return 500
                throw new HttpException("Error fetching playlist",
                    HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }

        // If none of the candidate paths existed, return 404
        throw new HttpException("Playlist not found",
            HttpStatus.NOT_FOUND)
    }

    @Get(":songId/segments/*segPath")
    async getSegment(
        @Param("songId") songId: string,
        @Param("segPath") segPathParam: string | string[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const { client, bucket } = this.s3ClientService.getS3Resources(S3Provider.Minio)
        const segPath = Array.isArray(segPathParam)
            ? segPathParam.join("/")
            : segPathParam
        const key = `processed/songs/${songId}/${segPath}`

        try {
            // Redis key for cached segments
            const redisKey = `video-segment:${songId}:${segPath}`

            // If client requested a Range, don't use cache (partial content)
            const range = req.headers.range as string | undefined
            if (!range) {
                // try redis first
                try {
                    const cached = await this.redisService.get(redisKey)
                    if (cached) {
                        const buf = Buffer.from(cached,
                            "base64")
                        res.setHeader("content-length",
                            buf.length.toString())
                        res.setHeader("accept-ranges",
                            "bytes")
                        res.setHeader("content-type",
                            "video/MP2T")
                        return res.send(buf)
                    }
                } catch (redisErr) {
                    // ignore redis errors and fallback to fetching from S3
                    console.error("Redis read failed for key",
                        redisKey,
                        redisErr)
                }
            }

            const params: GetObjectCommandInput = {
                Bucket: bucket,
                Key: key,
                ...(range
                    ? {
                        Range: range 
                    }
                    : {
                    }),
            }

            const cmd = new GetObjectCommand(params)
            const data = await client.send(cmd)

            if (!data.Body) {
                throw new Error("NoBody")
            }

            // If response already contains content-length/content-range, keep them
            if (data.ContentLength && !range) {
                // only set when not partial
                res.setHeader("content-length",
                    data.ContentLength.toString())
            }
            if (data.ContentRange) {
                res.setHeader("content-range",
                    data.ContentRange)
            }
            res.setHeader("accept-ranges",
                "bytes")
            res.setHeader("content-type",
                "video/MP2T")

            const body = data.Body as Readable

            // If it's a range request, stream directly
            if (range) {
                return body.pipe(res)
            }

            // Otherwise (no range): collect into buffer, cache in Redis (base64) and return
            const chunks: Buffer[] = []
            for await (const chunk of body) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
            }
            const buf = Buffer.concat(chunks)

            // store in redis as base64 with TTL (30 minutes default)
            const ttlSeconds = envConfig().redis.cache.ttlCacheStreamMs
            try {
                await this.redisService.set(redisKey,
                    buf.toString("base64"),
                    ttlSeconds)
            } catch (redisErr) {
                console.error("Redis set failed for key",
                    redisKey,
                    redisErr)
            }

            return res.send(buf)
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "NoSuchKey") {
                throw new HttpException("Segment not found",
                    HttpStatus.NOT_FOUND)
            }
            throw new HttpException("Error fetching segment",
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private async readStreamAsUtf8(stream: Readable): Promise<string> {
        const chunks: Buffer[] = []
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        }
        return Buffer.concat(chunks).toString("utf8")
    }

    private rewritePlaylistForProxy(playlist: string, songId: string): string {
        const playlistBasePath = `/api/s3/proxy/playlist/${songId}/`
        const segmentBasePath = `/api/s3/proxy/${songId}/segments/`

        return playlist
            .split(/\r?\n/)
            .map((line) => {
                const trimmed = line.trim()

                if (!trimmed) {
                    return line
                }

                if (trimmed.startsWith("#EXT-X-MAP:")) {
                    return line.replace(/URI="([^"]+)"/,
                        (_match, uri: string) => {
                            if (this.isAbsoluteOrRootPath(uri)) {
                                return `URI="${uri}"`
                            }
                            return uri.endsWith(".m3u8")
                                ? `URI="${playlistBasePath}${uri}"`
                                : `URI="${segmentBasePath}${uri}"`
                        })
                }

                if (trimmed.startsWith("#")) {
                    return line
                }

                if (this.isAbsoluteOrRootPath(trimmed)) {
                    return line
                }

                if (trimmed.endsWith(".m3u8")) {
                    return `${playlistBasePath}${trimmed}`
                }

                return `${segmentBasePath}${trimmed}`
            })
            .join("\n")
    }

    private isAbsoluteOrRootPath(uri: string): boolean {
        return uri.startsWith("http://")
            || uri.startsWith("https://")
            || uri.startsWith("/")
    }
}