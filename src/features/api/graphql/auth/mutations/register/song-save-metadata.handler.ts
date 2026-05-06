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
import {
    EnqueueProcessMusicJobService 
} from "@modules/bussiness"

@CommandHandler(SongSaveMetadataCommand)
@Injectable()
export class SongSaveMetadataHandler
    extends ICQRSHandler<SongSaveMetadataCommand, SongSaveMetadataResponseData>
    implements ICommandHandler<SongSaveMetadataCommand, SongSaveMetadataResponseData> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly enqueueProcessMusicJobService: EnqueueProcessMusicJobService
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

        await this.enqueueProcessMusicJobService.enqueue({
            songId: song.id,
            userId: request.userId,
        })

        return {
            song,
        }
    }
}
