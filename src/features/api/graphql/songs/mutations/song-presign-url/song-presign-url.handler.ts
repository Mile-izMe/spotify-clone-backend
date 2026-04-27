import {
    randomUUID,
} from "node:crypto"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    Injectable,
} from "@nestjs/common"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    S3BuildService,
} from "@modules/s3/s3-build.service"
import {
    S3Provider,
} from "@modules/s3/enums/s3"
import {
    SongPresignUrlCommand,
} from "./song-presign-url.command"
import {
    SongPresignUrlResponseData 
} from "./types"
import {
    extractFileExtension 
} from "./utils"

@CommandHandler(SongPresignUrlCommand)
@Injectable()
export class SongPresignUrlHandler
    extends ICQRSHandler<SongPresignUrlCommand, SongPresignUrlResponseData>
    implements ICommandHandler<SongPresignUrlCommand, SongPresignUrlResponseData> {
    constructor(
		private readonly s3Build: S3BuildService,
    ) {
        super()
    }

    protected override async process(
        command: SongPresignUrlCommand,
    ): Promise<SongPresignUrlResponseData> {
        const {
            request,
        } = command.params

        const key = this.buildSongUploadKey(request.fileName)
        const url = await this.s3Build.buildSignedPutObjectUrl({
            key,
            provider: S3Provider.Minio,
            contentType: request.contentType,
        })

        return {
            key,
            url,
        }
    }

    private buildSongUploadKey(fileName?: string): string {
        const extension = extractFileExtension(fileName)
        return `songs/audio/${randomUUID()}${extension}`
    }

}
