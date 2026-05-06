import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    Prisma,
} from "@prisma/client"
import {
    PrismaService,
} from "@modules/databases"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    GetUserByEmailQuery,
} from "./get-user-by-email.query"
import {
    GetUserByEmailResponseData,
    GetUserByEmailItem,
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
                email,
            },
        })

        if (!user) {
            return {
                data: null,
            }
        }

        const roleRows = await this.prisma.$queryRaw<Array<{
            roleName: string
            permissionName: string | null
        }>>(Prisma.sql`
            SELECT r.name AS "roleName",
                   p.name AS "permissionName"
            FROM user_roles ur
            INNER JOIN roles r ON ur.role_id = r.id
            LEFT JOIN role_permissions rp ON rp.role_id = r.id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = ${user.id}
        `)

        const roles = Array.from(new Set(roleRows.map((row) => row.roleName)))
        const permissions = Array.from(new Set(
            roleRows
                .map((row) => row.permissionName)
                .filter((permissionName): permissionName is string => Boolean(permissionName)),
        ))

        const mapped: GetUserByEmailItem = {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            isActive: user.isActive,
            status: user.status,
            roles,
            permissions,
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
