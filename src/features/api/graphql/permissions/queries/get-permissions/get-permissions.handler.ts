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
    GetPermissionsQuery,
} from "./get-permissions.query"
import {
    GetPermissionsResponseData,
} from "./types"
import {
    toPermissionItem,
} from "../../types"

@QueryHandler(GetPermissionsQuery)
@Injectable()
export class GetPermissionsHandler
    extends ICQRSHandler<GetPermissionsQuery, GetPermissionsResponseData>
    implements IQueryHandler<GetPermissionsQuery, GetPermissionsResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(): Promise<GetPermissionsResponseData> {
        const permissions = await this.prisma.permission.findMany({
            orderBy: {
                name: "asc",
            },
        })
        
        return {
            permissions: permissions.map(toPermissionItem),
        }
    }
}
