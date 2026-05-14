import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass,
} from "./query.module-definition"
import {
    GetRolesHandler,
    GetRolesService,
} from "./get-roles"
import {
    GetUserPermissionsHandler,
    GetUserPermissionsService,
} from "./get-user-permissions"
import {
    GetPermissionsHandler,
    GetPermissionsService,
} from "./get-permissions"
import {
    GetPermissionsByRoleHandler,
    GetPermissionsByRoleService,
} from "./get-permissions-by-role"

@Module({
    imports: [],
    providers: [
        GetRolesHandler,
        GetRolesService,
        GetUserPermissionsHandler,
        GetUserPermissionsService,
        GetPermissionsHandler,
        GetPermissionsService,
        GetPermissionsByRoleHandler,
        GetPermissionsByRoleService,
    ],
    exports: [
        GetRolesService,
        GetUserPermissionsService,
        GetPermissionsService,
        GetPermissionsByRoleService,
    ],
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
