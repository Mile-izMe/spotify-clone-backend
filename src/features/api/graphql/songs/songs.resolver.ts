import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    Locale,
} from "@modules/databases"
import {
    UseInterceptors
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
    SongSaveMetadataRequest,
    SongSaveMetadataResponse,
    SongSaveMetadataService,
} from "./mutations/song-save-metadata"
import {
    GetSongsService,
} from "./queries/songs/songs.service"
import {
    SongsRequest,
    SongsResponse,
    SongsResponseData,
} from "./queries/songs/types"

@Resolver()
// @UseGuards(JwtAuthGuard, PermissionsGuard)
export class SongsResolver {
    constructor(
        private readonly songsService: GetSongsService,
        private readonly songPresignUrlService: SongPresignUrlService,
        private readonly songSaveMetadataService: SongSaveMetadataService,
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
    // @CheckPermissions("song:read")
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

    /**
     * Saves song metadata and the uploaded file key into database.
     */
    @Mutation(
        () => SongSaveMetadataResponse,
        {
            name: "songSaveMetadata",
            description: "Creates a song record from the uploaded file key and metadata.",
        },
    )
    async songSaveMetadata(
        @Args(
            "request",
            {
                description: "Request containing the uploaded key and song metadata.",
            },
        )
            request: SongSaveMetadataRequest,
    ): Promise<SongSaveMetadataResponse> {
        const data = await this.songSaveMetadataService.execute({
            request,
        })

        return {
            success: true,
            message: "Song metadata saved successfully",
            data,
        }
    }
}
