import {
    Module,
} from "@nestjs/common"
import {
    ProcessorsConfigurableModuleClass,
} from "./processors.module-definition"
import {
    EnrollModule,
} from "./enroll"

/**
 * Module for the processors.
 */
@Module({
    imports: [
        EnrollModule.register(
            {
                isGlobal: true,
            }
        ),
    ],
})
export class ProcessorsModule extends ProcessorsConfigurableModuleClass {}
