import {
    SongUpdateRequest,
} from "./types"

export interface SongUpdateParams {
    request: SongUpdateRequest
}

export class SongUpdateCommand {
    constructor(
        readonly params: SongUpdateParams,
    ) {}
}