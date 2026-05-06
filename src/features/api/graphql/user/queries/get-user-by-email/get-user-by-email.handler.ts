import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    UserItem,
} from "../shared/user-item"
import {
    GetUserByEmailQuery,
} from "./get-user-by-email.query"
import {
    GetUserByEmailResponseData,
} from "./types"

@QueryHandler(GetUserByEmailQuery)
@Injectable()
export class GetUserByEmailHandler
    extends ICQRSHandler<GetUserByEmailQuery, GetUserByEmailResponseData>
    implements IQueryHandler<GetUserByEmailQuery, GetUserByEmailResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        query: GetUserByEmailQuery,
    ): Promise<GetUserByEmailResponseData> {
        const email = query.params.request.email

        const user = await this.prisma.user.findUnique({
            where: {
                email 
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
