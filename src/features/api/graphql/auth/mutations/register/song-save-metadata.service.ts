import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    SongSaveMetadataCommand,
    SongSaveMetadataParams,
} from "./song-save-metadata.command"
import {
    SongSaveMetadataResponseData,
} from "./types"

@Injectable()
export class SongSaveMetadataService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: SongSaveMetadataParams,
    ): Promise<SongSaveMetadataResponseData> {
        return this.commandBus.execute(
            new SongSaveMetadataCommand(params),
        )
    }
}
