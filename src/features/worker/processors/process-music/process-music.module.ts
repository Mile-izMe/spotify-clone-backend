import {
    Module,
} from "@nestjs/common"
import {
    ProcessMusicConfigurableModuleClass,
} from "./process-music.module-definition"
import {
    ProcessMusicDownloadStepService,
    // ProcessMusicAnalyzeStepService,
    // ProcessMusicTranscodeStepService,
    // ProcessMusicUploadStepService,
    // ProcessMusicFinalizeStepService,
} from "./steps"
import {
    ProcessMusicStepMappingService,
} from "./step-mapping.service"
import {
    ProcessMusicWorker,
} from "./process-music.worker"
import {
    ProcessMusicRequeueService,
} from "./requeue.service"

@Module({
    providers: [
        ProcessMusicWorker,
        ProcessMusicStepMappingService,
        ProcessMusicRequeueService,
        ProcessMusicDownloadStepService,
        // ProcessMusicAnalyzeStepService,
        // ProcessMusicTranscodeStepService,
        // ProcessMusicUploadStepService,
        // ProcessMusicFinalizeStepService,
    ],
})
export class ProcessMusicModule extends ProcessMusicConfigurableModuleClass {}
