import {
    SongSaveMetadataRequest,
} from "./types"

export interface SongSaveMetadataParams {
    request: SongSaveMetadataRequest
}

export class SongSaveMetadataCommand {
    constructor(
        readonly params: SongSaveMetadataParams,
    ) {}
}
