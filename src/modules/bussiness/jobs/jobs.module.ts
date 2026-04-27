import {
    DynamicModule,
    Module,
} from "@nestjs/common"
import {
    JobActionService,
    JobStalledService
} from "./atomic"
import {
    EnqueueProcessMusicJobService,
} from "./enqueue"
import {
    JOBS_MODULE_OPTIONS_TYPE,
    JobsConfigurableModuleClass,
} from "./jobs.module-definition"

/**
 * Module for job management.
 */
@Module({
})
export class JobsModule extends JobsConfigurableModuleClass {
    static register(options: typeof JOBS_MODULE_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers ?? []),
                JobActionService,
                JobStalledService,
                EnqueueProcessMusicJobService,
            ],
            exports: [
                JobActionService,
                JobStalledService,
                EnqueueProcessMusicJobService,
            ],
        }
    }
}
