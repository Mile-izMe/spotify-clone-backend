import {
    CheckPermissions,
    CurrentUser,
    PermissionName,
    JwtAuthGuard, PermissionsGuard
} from "@modules/common"
import {
    UseGuards
} from "@nestjs/common"
import {
    Args,
    Mutation,
    Resolver
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
    SongUpdateRequest,
    SongUpdateResponse,
    SongUpdateService,
} from "./mutations/song-update"

@Resolver()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SongsResolver {
    constructor(
        private readonly songPresignUrlService: SongPresignUrlService,
        private readonly songSaveMetadataService: SongSaveMetadataService,
        private readonly songUpdateService: SongUpdateService,
    ) {}
    
    /**
     * Creates a presigned upload URL for song audio.
     */
    @CheckPermissions(PermissionName.SongCreate)
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
    @CheckPermissions(PermissionName.SongCreate)
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
        @CurrentUser("userId") userId: string,
    ): Promise<SongSaveMetadataResponse> {
        const data = await this.songSaveMetadataService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Song metadata saved successfully",
            data,
        }
    }

    /**
     * Updates song fields and emits a songs.updated event.
     */
    @CheckPermissions(PermissionName.SongUpdate)
    @Mutation(
        () => SongUpdateResponse,
        {
            name: "songUpdate",
            description: "Updates song fields and publishes a songs.updated WebSocket event.",
        },
    )
    async songUpdate(
        @Args(
            "request",
            {
                description: "Request containing the song id and fields to update.",
            },
        )
            request: SongUpdateRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<SongUpdateResponse> {
        const data = await this.songUpdateService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Song updated successfully",
            data,
        }
    }
}
