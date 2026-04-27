import {
    S3Client,
} from "@aws-sdk/client-s3"
import {
    envConfig
} from "@modules/env"
import {
    Provider,
} from "@nestjs/common"
import {
    MINIO_S3
} from "./constants"

/**
 * Provider for MinIO specifically.
 */
export const createMinioProvider = (): Provider<S3Client | null> => ({
    provide: MINIO_S3,
    useFactory: () => new S3Client({
        endpoint: envConfig().s3.minio.endpoint,
        region: envConfig().s3.minio.region,
        credentials: {
            accessKeyId: envConfig().s3.minio.accessKeyId,
            secretAccessKey: envConfig().s3.minio.secretAccessKey,
        },
        forcePathStyle: true,
    }),
}) 
