import type {
    GetObjectCommandInput
} from "@aws-sdk/client-s3"
import {
    GetObjectCommand
} from "@aws-sdk/client-s3"
import {
    envConfig
} from "@modules/env"
import {
    RedisService,
} from "@modules/native"
import {
    Controller, Get, HttpException, HttpStatus, Param, Req, Res
} from "@nestjs/common"
import type {
    Request, Response
} from "express"
import {
    Buffer
} from "node:buffer"
import {
    posix
} from "node:path"
import type {
    Readable
} from "node:stream"
import {
    S3Provider
} from "./enums"
import {
    S3ClientService
} from "./s3-client.service"

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
        // "master.m3u8"
        const { client, bucket } = this.s3ClientService.getS3Resources(S3Provider.Minio)
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
                    songId, p)

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
        // Redis key for cached segments
        const redisKey = `video-segment:${songId}:${segPath}`
            
        try {
            // 1. Browser Cache Headers (OFFLINE/REPEAT)
            // Immutable caching for segments since they are content-addressed (unique keys) and won't change once written. This allows repeat viewers to cache segments in the browser for a long time, improving performance and reducing load on the server and S3.
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
            res.setHeader("accept-ranges", "bytes")
            res.setHeader("content-type", "video/MP2T")

            // If client requested a Range, don't use cache (partial content)
            const range = req.headers.range as string | undefined
            if (!range) {
                const cachedBuffer = await this.redisService.getBuffer(redisKey)
                if (cachedBuffer) {
                    res.setHeader("content-length", cachedBuffer.length.toString())
                    return res.send(cachedBuffer)
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
                await this.redisService.setBuffer(redisKey, buf, ttlSeconds)
                res.setHeader("content-length", buf.length.toString())
                return res.send(buf)
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

    /**
     * Rewrites playlist content to replace segment and nested playlist paths with proxied paths.
     * Using Path-mapping Strategy
     * @param playlist 
     * @param songId 
     * @param currentPath 
     * @returns 
     */
    private rewritePlaylistForProxy(playlist: string, songId: string, relativeS3Path: string): string {
        const PLAYLIST_ROOT = `/api/s3/proxy/playlist/${songId}/`
        const SEGMENT_ROOT = `/api/s3/proxy/${songId}/segments/`

        // Get folder contains current file (Ex: "128k/playlist.m3u8" -> "128k")
        // Use posix.dirname to ensure forward slashes for URLs (/)
        const currentFolder = posix.dirname(relativeS3Path)
        const isRoot = currentFolder === "."

        return playlist
            .split(/\r?\n/)
            .map((line) => {
                const trimmed = line.trim()

                // Skip empty lines and comments (except #EXT-X-MAP:)
                if (!trimmed || trimmed.startsWith("#") && !trimmed.startsWith("#EXT-X-MAP:")) {
                    return line
                }

                const resolver = (uri: string) => {
                    if (this.isAbsoluteOrRootPath(uri)) return uri

                    // Standard path: If at root, use filename; if in sub-folder, join the path
                    const internalPath = isRoot ? uri : posix.join(currentFolder, uri)

                    // Categorize resource for mapping into Controller Route
                    const baseProxyPath = uri.endsWith(".m3u8") ? PLAYLIST_ROOT : SEGMENT_ROOT
                    
                    return posix.join(baseProxyPath, internalPath)
                }
                

                if (trimmed.startsWith("#EXT-X-MAP:")) {
                    return line.replace(/URI="([^"]+)"/, (_, uri) => `URI="${resolver(uri)}"`)
                }

                return resolver(trimmed)
            })
            .join("\n")
    }

    private isAbsoluteOrRootPath(uri: string): boolean {
        return uri.startsWith("http://")
            || uri.startsWith("https://")
            || uri.startsWith("/")
    }
}