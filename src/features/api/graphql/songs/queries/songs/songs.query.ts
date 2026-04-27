import {
    SongsRequest,
} from "./types"

export interface SongsQueryParams {
    request: SongsRequest
}

export class SongsQuery {
    constructor(
        readonly params: SongsQueryParams,
    ) {}
}
