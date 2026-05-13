import {
    GetMyPlaylistsRequest,
} from "./types"

export interface GetMyPlaylistsQueryParams {
    request: GetMyPlaylistsRequest
    userId?: string
}

export class GetMyPlaylistsQuery {
    constructor(
        readonly params: GetMyPlaylistsQueryParams,
    ) {}
}
