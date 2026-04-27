import {
    GetObjectCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3"
import {
    Injectable,
} from "@nestjs/common"
import {
    S3ClientService
} from "./s3-client.service"
import {
    BuildPublicUrlParams, 
    BuildSignedGetUrlParams, 
    BuildSignedPutUrlParams 
} from "./types/build.types"
import {
    getSignedUrl 
} from "@aws-sdk/s3-request-presigner"

@Injectable()
export class S3BuildService {
    constructor(
        private readonly s3ClientService: S3ClientService,
    ) {
    }

    /**
   * Build public URL (Album Thumbnail or Avatar)
   */
    buildPublicObjectUrl({
        key, provider 
    }: BuildPublicUrlParams): string {
        const {
            endpoint, bucket 
        } = this.s3ClientService.getS3Resources(provider)
    
        // No '/' between endpoint and bucket
        const base = endpoint.endsWith("/") ? endpoint.slice(0,
            -1) : endpoint
    
        // Format: https://endpoint/bucket/key
        return `${base}/${bucket}/${key}`
    }

    /**
   * Create Signed URL (GET)
   */
    async buildSignedGetObjectUrl({
        key, provider 
    }: BuildSignedGetUrlParams): Promise<string> {
        const {
            client, bucket, expiration 
        } = this.s3ClientService.getS3Resources(provider)

        return getSignedUrl(
            client,
            new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }),
            {
                expiresIn: expiration 
            },
        )
    }

    /**
   * Build Signed URL for direct UPLOAD (PUT)
   * Client (React/Next.js) can use this URL to upload files directly to MinIO.
   */
    async buildSignedPutObjectUrl({
        key, provider, contentType 
    }: BuildSignedPutUrlParams): Promise<string> {
        const {
            client, bucket, expiration 
        } = this.s3ClientService.getS3Resources(provider)

        return getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: contentType,
            }),
            {
                expiresIn: expiration 
            },
        )
    }
}
