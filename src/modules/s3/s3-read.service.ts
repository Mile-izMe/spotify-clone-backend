import {
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    NoSuchKey,
    S3Client,
} from "@aws-sdk/client-s3"
import {
    envConfig
} from "@modules/env"
import {
    Injectable,
} from "@nestjs/common"
import type {
    Readable,
} from "node:stream"
import SuperJSON from "superjson"
import {
    S3Provider
} from "./enums"
import {
    InjectMinioS3
} from "./s3.decorators"
import {
    ListParams,
    ReadObjectParams
} from "./types"
import {
    InjectSuperJson 
} from "@modules/mixin"

@Injectable()
export class S3ReadService {
    constructor(
        @InjectMinioS3()
        private readonly minioS3: S3Client,
        @InjectSuperJson()
        private readonly superJson: SuperJSON,
    ) {
    }

    /**
     * Private helper to get the S3 client and bucket name based on the provider.
     */
    private getS3Resources(provider: S3Provider) {
        switch (provider) {
        case S3Provider.Minio:
            return {
                client: this.minioS3,
                bucket: envConfig().s3.minio.bucket,
            }
        default:
            throw new Error(`Provider ${provider} is not supported`)
        }
    }

    /**
     * Return stream (Readable)
     * Use this to return the file as a stream, which is more efficient for large files. 
     * The caller is responsible for consuming the stream and handling it appropriately.
     */
    async stream({
        key, provider
    }: ReadObjectParams): Promise<Readable> {
        const {
            client, bucket 
        } = this.getS3Resources(provider)

        try {
            const output = await client.send(
                new GetObjectCommand({
                    Bucket: bucket,
                    Key: key,
                })
            )

            if (!output.Body) {
                throw new Error(`Object with key ${key} not found in bucket ${bucket}`)
            }

            return output.Body as Readable
        } catch (error) {
            if (error instanceof NoSuchKey) {
                throw new Error(`Object with key ${key} not found in bucket ${bucket}`)
            }
            throw error
        }
    }
    
    /**
     * Return buffer. Use this for smaller files or when you need to manipulate
     * the file contents in memory.
     */
    async buffer(params: ReadObjectParams): Promise<Buffer> {
        const stream = await this.stream(params)
        const chunks: Buffer[] = []

        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        }
        return Buffer.concat(chunks)
    }

    /**
     * Return JSON. 
     * The file contents are JSON and parse it directly into an object.
     */
    async json<T>(params: ReadObjectParams): Promise<T | null> {
        try {
            const buf = await this.buffer(params)
            const content = buf.toString("utf8")
            return this.superJson.parse<T>(content)
        } catch {
            return null
        }
    }

    /**
     * Check file exists using HeadObject (does not download the file, saves resources).
     */
    async exists({
        key, provider 
    }: ReadObjectParams): Promise<boolean> {
        const {
            client, bucket 
        } = this.getS3Resources(provider)
        try {
            await client.send(
                new HeadObjectCommand({
                    Bucket: bucket,
                    Key: key,
                }),
            )
            return true
        } catch {
            return false
        }
    }

    /**
     * List the contents of a "directory" or file.
     */
    async list({
        key, provider 
    }: ListParams): Promise<string[]> {
        const {
            client, bucket 
        } = this.getS3Resources(provider)
        const prefix = key.endsWith("/") ? key : `${key}/`

        const result = await client.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefix,
                Delimiter: "/",
            }),
        )

        return (result.CommonPrefixes ?? [])
            .map((p) => p.Prefix?.replace(prefix,
                "").replace("/",
                ""))
            .filter((p): p is string => !!p)
    }
}
