import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    GetPlaylistSongsQuery,
} from "./playlist-songs.query"
import {
    PlaylistSongsResponseData,
} from "./types"
import {
    toPlaylistItem,
} from "../../types"

@QueryHandler(GetPlaylistSongsQuery)
@Injectable()
export class GetPlaylistSongsHandler
    extends ICQRSHandler<GetPlaylistSongsQuery, PlaylistSongsResponseData>
    implements IQueryHandler<GetPlaylistSongsQuery, PlaylistSongsResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        query: GetPlaylistSongsQuery,
    ): Promise<PlaylistSongsResponseData> {
        const {
            request,
            userId,
        } = query.params

        const playlist = await this.prisma.playlist.findFirst({
            where: {
                id: request.playlistId,
                deletedAt: null,
            },
            select: {
                id: true,
                userId: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        songs: true,
                    },
                },
            },
        })

        if (!playlist) {
            throw new NotFoundException("Playlist not found")
        }

        if (playlist.userId !== userId) {
            throw new ForbiddenException("You do not own this playlist")
        }

        const relations = await this.prisma.playlistSong.findMany({
            where: {
                playlistId: request.playlistId,
                deletedAt: null,
                song: {
                    deletedAt: null,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                song: true,
            },
        })

        const songs = relations.map(({ song }) => ({
            ...song,
            audioUrl: `/api/s3/proxy/playlist/${song.id}`,
            isEditable: userId ? song.createdBy === userId : false,
        }))

        return {
            playlist: toPlaylistItem(playlist),
            songs,
        }
    }
}
