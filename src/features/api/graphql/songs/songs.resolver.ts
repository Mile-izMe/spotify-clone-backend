import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    Locale,
} from "@modules/databases"
import {
    UseInterceptors,
} from "@nestjs/common"
import {
    Args,
    Mutation,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    SongPresignUrlRequest,
    SongPresignUrlResponse,
    SongPresignUrlService
} from "./mutations/song-presign-url"
import {
    GetSongsService,
} from "./queries/songs/songs.service"
import {
    SongsRequest,
    SongsResponse,
    SongsResponseData,
} from "./queries/songs/types"

@Resolver()
export class SongsResolver {
    constructor(
        private readonly songsService: GetSongsService,
        private readonly songPresignUrlService: SongPresignUrlService,
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

    /**
     * Creates a presigned upload URL for song audio.
     */
    @Mutation(
        () => SongPresignUrlResponse,
        {
            name: "songPresignUrl",
            description: "Creates a presigned PUT URL for uploading song audio to MinIO.",
        },
    )
    async songPresignUrl(
        @Args(
            "request",
            {
                description: "Request for the presigned upload URL.",
            },
        )
            request: SongPresignUrlRequest,
    ): Promise<SongPresignUrlResponse> {
        const data = await this.songPresignUrlService.execute({
            request,
        })

        return {
            success: true,
            message: "Song presigned URL created successfully",
            data,
        }
    }
}
