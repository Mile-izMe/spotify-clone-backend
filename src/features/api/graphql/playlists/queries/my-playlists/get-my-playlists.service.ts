import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetMyPlaylistsQuery,
    GetMyPlaylistsQueryParams,
} from "./get-my-playlists.query"
import {
    GetMyPlaylistsResponseData,
} from "./types"

@Injectable()
export class GetMyPlaylistsService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: GetMyPlaylistsQueryParams,
    ): Promise<GetMyPlaylistsResponseData> {
        return this.queryBus.execute(
            new GetMyPlaylistsQuery(params),
        )
    }
}
