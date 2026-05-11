import {
    SongUpdateRequest,
} from "./types"

export interface SongUpdateParams {
    request: SongUpdateRequest
    userId: string
}

export class SongUpdateCommand {
    constructor(
        readonly params: SongUpdateParams,
    ) {}
}