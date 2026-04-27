import {
    Module,
} from "@nestjs/common"
import {
    WorkerConfigurableModuleClass,
} from "./worker.module-definition"
import {
    ProcessorsModule,
} from "./processors"

@Module({
    imports: [
        ProcessorsModule.register({
            isGlobal: true,
        }),
    ],
})
export class WorkerModule extends WorkerConfigurableModuleClass {}
