import {
    S3Client
} from "@aws-sdk/client-s3"
import {
    envConfig
} from "@modules/env"
import {
    Injectable,
} from "@nestjs/common"
import {
    S3Provider
} from "./enums"
import {
    InjectMinioS3
} from "./s3.decorators"

@Injectable()
export class S3ClientService {
    constructor(
        @InjectMinioS3()
        private readonly minioS3: S3Client,
    ) {
    }

    public getS3Resources(provider: S3Provider) {
        switch (provider) {
        case S3Provider.Minio:
            return {
                client: this.minioS3,
                bucket: envConfig().s3.minio.bucket,
                endpoint: envConfig().s3.minio.endpoint,
                expiration: envConfig().s3.minio.presignedUrl.expiration,
            }
        default:
            throw new Error(`Provider ${provider} is not supported`)
        }
    }
}
