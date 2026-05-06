import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler, QueryHandler
} from "@nestjs/cqrs"
import {
    GetUserByIdQuery
} from "./get-user-by-id.query"
import {
    PrismaService
} from "@modules/databases"
import {
    GetUserByIdResponseData,
    UserItem,
} from "./types"
import {
    ICQRSHandler
} from "@modules/cqrs"

@QueryHandler(GetUserByIdQuery)
@Injectable()
export class GetUserByIdHandler
    extends ICQRSHandler<GetUserByIdQuery, GetUserByIdResponseData>
    implements IQueryHandler<GetUserByIdQuery, GetUserByIdResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        query: GetUserByIdQuery,
    ): Promise<GetUserByIdResponseData> {
        const id = query.params.request.id

        const user = await this.prisma.user.findUnique({
            where: {
                id 
            },
        })

        if (!user) {
            return {
                data: null,
            }
        }

        const mapped: UserItem = {
            id: user.id,
            username: user.username,
            password: user.password,
            createdAt: user.createdAt,
            createBy: user.createBy,
            updatedAt: user.updatedAt,
            updateBy: user.updateBy,
        }

        return {
            data: mapped,
        }
    }
}
