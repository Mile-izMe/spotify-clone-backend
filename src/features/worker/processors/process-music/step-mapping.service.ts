import {
    AbstractStepService,
    ProcessMusicPayload
} from "@modules/bull"
import {
    Injectable,
} from "@nestjs/common"
import {
    ProcessMusicDownloadStepService,
    ProcessMusicAnalyzeCompleteStepService,
    ProcessMusicTranscodeCompleteStepService,
    ProcessMusicUploadCompleteStepService,
    ProcessMusicFinalizeCompleteStepService,
} from "./steps"
import type {
    ExtendedProcessMusicContext,
} from "./types"

/**
 * Process music pipeline: download → analyze → transcode → upload → finalize.
 */
@Injectable()
export class ProcessMusicStepMappingService {
    constructor(
        private readonly downloadStepService: ProcessMusicDownloadStepService,
        private readonly analyzeStepService: ProcessMusicAnalyzeCompleteStepService,
        private readonly transcodeStepService: ProcessMusicTranscodeCompleteStepService,
        private readonly uploadStepService: ProcessMusicUploadCompleteStepService,
        private readonly finalizeStepService: ProcessMusicFinalizeCompleteStepService,
    ) { }

    /**
     * Get the step map.
     * @returns The step map.
     */
    getStepMap(): Map<
        number,
        AbstractStepService<
            ProcessMusicPayload,
            ExtendedProcessMusicContext
        >
        > {
        return new Map<number, AbstractStepService<
            ProcessMusicPayload,
            ExtendedProcessMusicContext
        >>(
            [
                [
                    this.downloadStepService.stepIndex,
                    this.downloadStepService,
                ],
                [
                    this.analyzeStepService.stepIndex,
                    this.analyzeStepService,
                ],
                [
                    this.transcodeStepService.stepIndex,
                    this.transcodeStepService,
                ],
                [
                    this.uploadStepService.stepIndex,
                    this.uploadStepService,
                ],
                [
                    this.finalizeStepService.stepIndex,
                    this.finalizeStepService,
                ],
            ],
        )
    }
}
