import {
    AbstractStepService,
    ProcessMusicPayload
} from "@modules/bull"
import {
    Injectable,
} from "@nestjs/common"
import {
    ProcessMusicDownloadStepService,
    ProcessMusicAnalyzeStepService,
    ProcessMusicTranscodeStepService,
    ProcessMusicUploadStepService,
    ProcessMusicFinalizeStepService,
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
        private readonly analyzeStepService: ProcessMusicAnalyzeStepService,
        private readonly transcodeStepService: ProcessMusicTranscodeStepService,
        private readonly uploadStepService: ProcessMusicUploadStepService,
        private readonly finalizeStepService: ProcessMusicFinalizeStepService,
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
