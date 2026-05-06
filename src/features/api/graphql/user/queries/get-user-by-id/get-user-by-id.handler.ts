import {
    ICQRSHandler
} from "@modules/cqrs"
import {
    PrismaService
} from "@modules/databases"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler, QueryHandler
} from "@nestjs/cqrs"
import {
    UserItem,
} from "../shared/user-item"
import {
    GetUserByIdQuery
} from "./get-user-by-id.query"
import {
    GetUserByIdResponseData,
} from "./types"

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
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!user) {
            return {
                data: null,
            }
        }

        // Extract roles from the nested structure
        const roles = user.roles.map((ur) => ur.role.name)

        // Extract permissions and remove duplicates using Set
        const permissions = Array.from(
            new Set(
                user.roles.flatMap((ur) =>
                    ur.role.permissions.map((rp) => rp.permission.name),
                ),
            ),
        )

        const mapped: UserItem = {
            ...user,
            roles,
            permissions,
        }

        return {
            data: mapped,
        }
    }
}
