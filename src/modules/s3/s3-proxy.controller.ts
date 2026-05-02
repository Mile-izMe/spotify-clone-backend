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

@Controller("s3/proxy")
export class S3ProxyController {
    constructor(private readonly s3ClientService: S3ClientService) {}

    @Get("playlist/:songId")
    async getPlaylist(@Param("songId") songId: string, @Res() res: Response) {
        const { client, bucket } = this.s3ClientService.getS3Resources(S3Provider.Minio)
        const key = `processed/songs/${songId}/playlist.m3u8`

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
            res.send(rewrittenPlaylist)
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "NoSuchKey") {
                throw new HttpException("Playlist not found",
                    HttpStatus.NOT_FOUND)
            }
            throw new HttpException("Error fetching playlist",
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
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
            const range = req.headers.range as string | undefined
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

            if (data.ContentLength) {
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
            body.pipe(res)
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
                            return `URI="${segmentBasePath}${uri}"`
                        })
                }

                if (trimmed.startsWith("#")) {
                    return line
                }

                if (this.isAbsoluteOrRootPath(trimmed)) {
                    return line
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