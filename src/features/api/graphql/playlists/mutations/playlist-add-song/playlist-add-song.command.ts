import {
    PlaylistAddSongRequest,
} from "./types"

export interface PlaylistAddSongParams {
    request: PlaylistAddSongRequest
    userId: string
}

export class PlaylistAddSongCommand {
    constructor(
        readonly params: PlaylistAddSongParams,
    ) {}
}
