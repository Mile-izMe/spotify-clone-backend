import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    UseInterceptors,
} from "@nestjs/common"
import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    Locale,
} from "@modules/databases"
import {
    SongsRequest,
    SongsResponse,
    SongsResponseData,
} from "./types"
import {
    GetSongsService,
} from "./queries/songs.service"

@Resolver()
export class SongsResolver {
    constructor(
        private readonly songsService: GetSongsService,
    ) { }

    /**
        * Lists songs with cursor-first pagination and page fallback.
     */
    @GraphQLSuccessMessage({
        [Locale.En]: "Songs fetched successfully",
        [Locale.Vi]: "Lấy danh sách bài hát thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => SongsResponse,
        {
            name: "songs",
            description: "Lists songs with cursor pagination (and page fallback).",
        },
    )
    async execute(
        @Args(
            "request",
            {
                description: "Content id, pagination, and sort request.",
            },
        )
            request: SongsRequest,
    ): Promise<SongsResponseData> {
        return this.songsService.execute(
            {
                request,
            },
        )
    }
}
