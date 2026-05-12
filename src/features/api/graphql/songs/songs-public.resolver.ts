import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    CurrentUser,
    OptionalJwtAuthGuard,
} from "@modules/common"
import {
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    GetSongsService,
} from "./queries/songs/songs.service"
import {
    SongsRequest,
    SongsResponse,
    SongsResponseData,
} from "./queries/songs/types"

@Resolver()
@UseGuards(OptionalJwtAuthGuard)
export class SongsPublicResolver {
    constructor(
        private readonly songsService: GetSongsService,
    ) {}

    /**
    * Lists songs with cursor-first pagination and page fallback.
    */
    @GraphQLSuccessMessage({
        en: "Songs fetched successfully",
        vi: "Lấy danh sách bài hát thành công",
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
        @CurrentUser("userId") userId?: string,
    ): Promise<SongsResponseData> {
        return this.songsService.execute(
            {
                request,
                userId,
            },
        )
    }
}
