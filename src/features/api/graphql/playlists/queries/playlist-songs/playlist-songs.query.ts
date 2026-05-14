import {
    GetPlaylistSongsRequest,
} from "./types"

export interface GetPlaylistSongsQueryParams {
    request: GetPlaylistSongsRequest
    userId?: string
}

export class GetPlaylistSongsQuery {
    constructor(
        readonly params: GetPlaylistSongsQueryParams,
    ) {}
}
