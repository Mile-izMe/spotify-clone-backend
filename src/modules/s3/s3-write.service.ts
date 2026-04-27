import {
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import {
    envConfig
} from "@modules/env"
import {
    InjectSuperJson 
} from "@modules/mixin"
import {
    AsyncService
} from "@modules/mixin/async.service"
import {
    Injectable
} from "@nestjs/common"
import SuperJSON from "superjson"
import {
    S3Provider
} from "./enums"
import {
    S3ReadService
} from "./s3-read.service"
import {
    InjectMinioS3
} from "./s3.decorators"
import {
    UploadBufferParams,
    UploadJsonParams,
    UploadPayload,
    UploadStreamParams
} from "./types"


@Injectable()
export class S3WriteService {
    constructor(
        @InjectMinioS3()
        private readonly minioS3: S3Client,
        private readonly s3ReadService: S3ReadService,
        private readonly asyncService: AsyncService,
        @InjectSuperJson()
        private readonly superJson: SuperJSON,
    ) {
    }

    private getResources(provider: S3Provider) {
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
     * Upload JSON with Hash for optimization
     */
    async json<T extends UploadPayload>(
        {
            name, payload, acl, providers 
        }: UploadJsonParams<T>,
    ): Promise<void> {
        const promises = providers.map(async (provider) => {
            try {
                const {
                    client, bucket 
                } = this.getResources(provider)
                
                // Read old data to compare hash
                const existingData = await this.s3ReadService.json<UploadPayload>({
                    key: name,
                    provider,
                })

                // Nếu dữ liệu đã tồn tại và hash không đổi thì bỏ qua upload
                if (existingData && existingData.hash === payload.hash) {
                    return
                }

                await client.send(
                    new PutObjectCommand({
                        Bucket: bucket,
                        Key: name,
                        Body: this.superJson.stringify(payload),
                        ACL: acl,
                        ContentType: "application/json",
                    }),
                )
            } catch (error) {
                console.error(`[S3UploadService] Failed to upload JSON to ${provider}:`,
                    error)
            }
        })

        await this.asyncService.allIgnoreError(promises)
    }

    /**
     * Upload Buffer (Image, small files, etc.)
     */
    async buffer(
        {
            name, buffer, acl, provider, contentType 
        }: UploadBufferParams,
    ): Promise<void> {
        const {
            client, bucket 
        } = this.getResources(provider)

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: name,
                Body: buffer,
                ACL: acl,
                ContentType: contentType,
            }),
        )
    }

    /**
     * Upload Stream (Use for large music file/video streaming)
     */
    async stream(
        {
            name, stream, acl, provider, contentType 
        }: UploadStreamParams,
    ): Promise<void> {
        const {
            client, bucket 
        } = this.getResources(provider)

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: name,
                Body: stream,
                ACL: acl,
                ContentType: contentType,
            }),
        )
    }

}
