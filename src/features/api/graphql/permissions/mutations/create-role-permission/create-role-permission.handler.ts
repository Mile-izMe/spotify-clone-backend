import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    BadRequestException,
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    CreateRolePermissionCommand,
} from "./create-role-permission.command"
import {
    CreateRolePermissionResponseData,
} from "./types"
import {
    toRolePermissionItem,
} from "../../types"

@CommandHandler(CreateRolePermissionCommand)
@Injectable()
export class CreateRolePermissionHandler
    extends ICQRSHandler<CreateRolePermissionCommand, CreateRolePermissionResponseData>
    implements ICommandHandler<CreateRolePermissionCommand, CreateRolePermissionResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: CreateRolePermissionCommand,
    ): Promise<CreateRolePermissionResponseData> {
        const {
            request,
        } = command.params

        const roleIds = Array.from(new Set(request.roleIds ?? []))
        const permissionIds = Array.from(new Set(request.permissionIds ?? []))

        if (!roleIds.length) {
            throw new BadRequestException("roleIds must not be empty")
        }

        if (!permissionIds.length) {
            throw new BadRequestException("permissionIds must not be empty")
        }

        const data = roleIds.flatMap((roleId) => {
            return permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            }))
        })

        await this.prisma.rolePermission.createMany({
            data,
            skipDuplicates: true,
        })

        const rolePermissions = await this.prisma.rolePermission.findMany({
            where: {
                roleId: {
                    in: roleIds,
                },
                permissionId: {
                    in: permissionIds,
                },
            },
            include: {
                role: true,
                permission: true,
            },
            orderBy: [
                {
                    roleId: "asc",
                },
                {
                    permissionId: "asc",
                },
            ],
        })

        return {
            rolePermissions: rolePermissions.map(toRolePermissionItem),
        }
    }
}
