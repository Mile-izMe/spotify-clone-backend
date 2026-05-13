import {
    PlaylistCreateRequest,
} from "./types"

export interface PlaylistCreateParams {
    request: PlaylistCreateRequest
    userId: string
}

export class PlaylistCreateCommand {
    constructor(
        readonly params: PlaylistCreateParams,
    ) {}
}
