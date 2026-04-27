import {
    Prisma,
} from "@prisma/client"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler, QueryHandler 
} from "@nestjs/cqrs"
import {
    SongsQuery 
} from "./songs.query"
import {
    PrismaService 
} from "@modules/databases"
import {
    S3BuildService 
} from "@modules/s3/s3-build.service"
import {
    SongsResponseData 
} from "../types"
import {
    S3Provider 
} from "@modules/s3/enums/s3"
import {
    ICQRSHandler 
} from "@modules/cqrs"
import {
    buildSongOrderBy,
    buildSongWhere,
} from "./utils"
import {
    decodeCursor,
    encodeCursor,
    normalizeLimit,
    normalizePageNumber,
} from "../../shared"

@QueryHandler(SongsQuery)
@Injectable()
export class GetSongsHandler 
    extends ICQRSHandler<SongsQuery, SongsResponseData> 
    implements IQueryHandler<SongsQuery, SongsResponseData> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3Build: S3BuildService,
    ) {
        super()
    }

    protected override async process(
        query: SongsQuery,
    ): Promise<SongsResponseData> {
        const filters = query.params.request.filters
        const limit = normalizeLimit(filters.limit)
        const pageNumber = normalizePageNumber(filters.pageNumber)
        const cursorId = decodeCursor(filters.cursor)
        const where: Prisma.SongWhereInput = buildSongWhere(filters.search)
        const orderBy = buildSongOrderBy(filters.sorts)
        const skip = cursorId
            ? 1
            : (pageNumber - 1) * limit

        const [songs,
            total] = await Promise.all([
            this.prisma.song.findMany({
                where,
                orderBy,
                take: limit + 1,
                skip,
                ...(cursorId && {
                    cursor: {
                        id: cursorId,
                    },
                }),
            }),
            this.prisma.song.count({
                where,
            }),
        ])

        const hasNextPage = songs.length > limit
        const currentItems = hasNextPage
            ? songs.slice(0,
                limit)
            : songs

        const mappedData = await Promise.all(currentItems.map(async (song) => ({
            ...song,
            audioUrl: await this.s3Build.buildSignedGetObjectUrl({
                key: song.audioUrl,
                provider: S3Provider.Minio,
            }),
        })))

        const nextCursor = hasNextPage && currentItems.length
            ? encodeCursor(currentItems[currentItems.length - 1].id)
            : undefined

        return {
            count: total,
            data: mappedData,
            cursor: nextCursor,
        }
    }

}