import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    SongUpdateCommand,
    SongUpdateParams,
} from "./song-update.command"
import {
    SongUpdateResponseData,
} from "./types"

@Injectable()
export class SongUpdateService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: SongUpdateParams,
    ): Promise<SongUpdateResponseData> {
        return this.commandBus.execute(
            new SongUpdateCommand(params),
        )
    }
}