import {
    SetMetadata 
} from "@nestjs/common"
import {
    PermissionName,
    PERMISSIONS_KEY 
} from "../types"

export const CheckPermissions = (...permissions: PermissionName[]) => {
    return SetMetadata(PERMISSIONS_KEY, permissions)
}