import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    PlaylistAddSongCommand,
    PlaylistAddSongParams,
} from "./playlist-add-song.command"
import {
    PlaylistAddSongResponseData,
} from "./types"

@Injectable()
export class PlaylistAddSongService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: PlaylistAddSongParams,
    ): Promise<PlaylistAddSongResponseData> {
        return this.commandBus.execute(
            new PlaylistAddSongCommand(params),
        )
    }
}
