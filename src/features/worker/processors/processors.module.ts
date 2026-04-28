import {
    Module,
} from "@nestjs/common"
import {
    ProcessMusicModule 
} from "./process-music"
import {
    ProcessorsConfigurableModuleClass,
} from "./processors.module-definition"

/**
 * Module for the processors.
 */
@Module({
    imports: [
        ProcessMusicModule.register(
            {
                isGlobal: true,
            }
        ),
    ],
})
export class ProcessorsModule extends ProcessorsConfigurableModuleClass {}
