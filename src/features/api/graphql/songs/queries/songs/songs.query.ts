import {
    SongsRequest,
} from "./types"

export interface SongsQueryParams {
    request: SongsRequest
    userId?: string
}

export class SongsQuery {
    constructor(
        readonly params: SongsQueryParams,
    ) {}
}
