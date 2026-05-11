import {
    SongSaveMetadataRequest,
} from "./types"

export interface SongSaveMetadataParams {
    request: SongSaveMetadataRequest
    userId: string
}

export class SongSaveMetadataCommand {
    constructor(
        readonly params: SongSaveMetadataParams,
    ) {}
}
