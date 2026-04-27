import {
    DynamicModule,
    Module
} from "@nestjs/common"
import {
    S3BuildService,
} from "./s3-build.service"
import {
    S3ReadService,
} from "./s3-read.service"
import {
    S3WriteService
} from "./s3-write.service"
import {
    S3ConfigurableModuleClass,
    S3_OPTIONS_TYPE
} from "./s3.module-definition"
import {
    createMinioProvider,
} from "./s3.providers"
import {
    S3ClientService 
} from "./s3-client.service"

/**
 * S3 module.
 */
@Module({
})
export class S3Module extends S3ConfigurableModuleClass {
    static register(options: typeof S3_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        
        const minioS3Provider = createMinioProvider()

        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers ?? []),
                minioS3Provider,
                S3WriteService,
                S3ReadService,
                S3BuildService,
                S3ClientService,
            ],
            exports: [
                minioS3Provider,
                S3WriteService,
                S3ReadService,
                S3BuildService,
                S3ClientService,
            ],
        }
    }
}