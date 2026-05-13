import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    PlaylistCreateCommand,
    PlaylistCreateParams,
} from "./playlist-create.command"
import {
    PlaylistCreateResponseData,
} from "./types"

@Injectable()
export class PlaylistCreateService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: PlaylistCreateParams,
    ): Promise<PlaylistCreateResponseData> {
        return this.commandBus.execute(
            new PlaylistCreateCommand(params),
        )
    }
}
