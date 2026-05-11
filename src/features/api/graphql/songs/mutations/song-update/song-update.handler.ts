import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    Prisma,
} from "@prisma/client"
import {
    SongUpdateCommand,
} from "./song-update.command"
import {
    SongUpdateResponseData,
} from "./types"

@CommandHandler(SongUpdateCommand)
@Injectable()
export class SongUpdateHandler
    extends ICQRSHandler<SongUpdateCommand, SongUpdateResponseData>
    implements ICommandHandler<SongUpdateCommand, SongUpdateResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: SongUpdateCommand,
    ): Promise<SongUpdateResponseData> {
        const {
            request,
            userId
        } = command.params

        const existingSong = await this.prisma.song.findUnique({
            where: {
                id: request.id,
            },
            select: {
                createdBy: true,
            }
        })

        if (!existingSong) {
            throw new NotFoundException("Song not found")
        }

        if (existingSong.createdBy !== userId) {
            throw new ForbiddenException("You do not have permission to edit this song")
        }

        const data: Prisma.SongUpdateInput = {
        }

        if (request.title !== undefined) {
            data.title = request.title
        }

        if (request.artist !== undefined) {
            data.artist = request.artist
        }

        if (request.audioUrl !== undefined) {
            data.audioUrl = request.audioUrl
        }

        if (request.thumbnailUrl !== undefined) {
            data.thumbnailUrl = request.thumbnailUrl
        }

        if (request.duration !== undefined) {
            data.duration = request.duration
        }

        if (Object.keys(data).length === 0) {
            throw new BadRequestException("At least one song field must be provided")
        }

        const song = await this.prisma.song.update({
            where: {
                id: request.id,
            },
            data,
        })

        return {
            song,
        }
    }

    protected override getWebsocketEvent(): string {
        return "songs.updated"
    }

    protected override getWebsocketData(
        _command: SongUpdateCommand,
        response: SongUpdateResponseData,
    ): unknown {
        void _command

        return response.song
    }
}