import {
    Args,
    Mutation,
    Resolver
} from "@nestjs/graphql"
import {
    SongPresignUrlRequest,
    SongPresignUrlResponse,
    SongPresignUrlService
} from "./mutations/login"
import {
    SongSaveMetadataRequest,
    SongSaveMetadataResponse,
    SongSaveMetadataService,
} from "./mutations/register"

@Resolver()
export class AuthResolver {
    constructor(
        private readonly songPresignUrlService: SongPresignUrlService,
        private readonly songSaveMetadataService: SongSaveMetadataService,
    ) { }

    /**
     * Login
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
     * Register
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
