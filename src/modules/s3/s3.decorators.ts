import {
    Inject,
} from "@nestjs/common"
import {
    MINIO_S3,
} from "./constants"

/** Inject the AWS S3 configuration specifically. */
export const InjectMinioS3 = () => Inject(MINIO_S3)