import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    SongPresignUrlCommand,
    SongPresignUrlParams,
} from "./song-presign-url.command"
import {
    SongPresignUrlResponseData 
} from "./types"


@Injectable()
export class SongPresignUrlService {
    constructor(
		private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: SongPresignUrlParams,
    ): Promise<SongPresignUrlResponseData> {
        return this.commandBus.execute(
            new SongPresignUrlCommand(params),
        )
    }
}
