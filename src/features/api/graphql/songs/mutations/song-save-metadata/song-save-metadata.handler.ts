import {
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    SongSaveMetadataCommand,
} from "./song-save-metadata.command"
import {
    SongSaveMetadataResponseData,
} from "./types"

@CommandHandler(SongSaveMetadataCommand)
@Injectable()
export class SongSaveMetadataHandler
    extends ICQRSHandler<SongSaveMetadataCommand, SongSaveMetadataResponseData>
    implements ICommandHandler<SongSaveMetadataCommand, SongSaveMetadataResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: SongSaveMetadataCommand,
    ): Promise<SongSaveMetadataResponseData> {
        const {
            request,
        } = command.params

        const song = await this.prisma.song.create({
            data: {
                audioUrl: request.key,
                artist: request.artist,
                title: request.title,
                thumbnailUrl: request.thumbnailUrl,
                duration: request.duration,
            },
        })

        return {
            song,
        }
    }
}
