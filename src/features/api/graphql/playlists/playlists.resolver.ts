import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    CurrentUser,
    JwtAuthGuard,
} from "@modules/common"
import {
    Locale,
} from "@modules/databases"
import {
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import {
    Args,
    Mutation,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    PlaylistAddSongRequest,
    PlaylistAddSongResponse,
    PlaylistAddSongService,
} from "./mutations/playlist-add-song"
import {
    PlaylistCreateRequest,
    PlaylistCreateResponse,
    PlaylistCreateService,
} from "./mutations/playlist-create"
import {
    GetMyPlaylistsRequest,
    GetMyPlaylistsResponse,
    GetMyPlaylistsResponseData,
    GetMyPlaylistsService,
} from "./queries/my-playlists"

@Resolver()
@UseGuards(JwtAuthGuard)
export class PlaylistsResolver {
    constructor(
        private readonly playlistCreateService: PlaylistCreateService,
        private readonly getMyPlaylistsService: GetMyPlaylistsService,
        private readonly playlistAddSongService: PlaylistAddSongService,
    ) {}

    @GraphQLSuccessMessage({
        [Locale.En]: "Playlists fetched successfully",
        [Locale.Vi]: "Lấy danh sách playlist thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GetMyPlaylistsResponse,
        {
            name: "myPlaylists",
            description: "Lists playlists that belong to the current user.",
        },
    )
    async myPlaylists(
        @Args(
            "request",
            {
                description: "Pagination, search and sort filters.",
            },
        )
            request: GetMyPlaylistsRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<GetMyPlaylistsResponseData> {
        return this.getMyPlaylistsService.execute({
            request,
            userId,
        })
    }

    @Mutation(
        () => PlaylistCreateResponse,
        {
            name: "createPlaylist",
            description: "Creates a playlist for the current user.",
        },
    )
    async createPlaylist(
        @Args(
            "request",
            {
                description: "Playlist creation payload.",
            },
        )
            request: PlaylistCreateRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<PlaylistCreateResponse> {
        const data = await this.playlistCreateService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Playlist created successfully",
            data,
        }
    }

    @Mutation(
        () => PlaylistAddSongResponse,
        {
            name: "addSongToPlaylist",
            description: "Adds a song to a playlist owned by the current user.",
        },
    )
    async addSongToPlaylist(
        @Args(
            "request",
            {
                description: "Playlist and song identifiers.",
            },
        )
            request: PlaylistAddSongRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<PlaylistAddSongResponse> {
        const data = await this.playlistAddSongService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Song added to playlist successfully",
            data,
        }
    }
}
