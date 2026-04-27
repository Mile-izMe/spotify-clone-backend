import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    SongsQuery,
    SongsQueryParams,
} from "./songs.query"
import {
    SongsResponseData,
} from "./types"


@Injectable()
export class GetSongsService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: SongsQueryParams,
    ): Promise<SongsResponseData> {
        return this.queryBus.execute(
            new SongsQuery(params),
        )
    }
}
