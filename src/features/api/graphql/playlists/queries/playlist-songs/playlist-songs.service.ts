import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetPlaylistSongsQuery,
    GetPlaylistSongsQueryParams,
} from "./playlist-songs.query"
import {
    PlaylistSongsResponseData,
} from "./types"

@Injectable()
export class PlaylistSongsService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: GetPlaylistSongsQueryParams,
    ): Promise<PlaylistSongsResponseData> {
        return this.queryBus.execute(
            new GetPlaylistSongsQuery(params),
        )
    }
}
