import {
    SetMetadata 
} from "@nestjs/common"
import {
    PERMISSIONS_KEY 
} from "../types"

export const CheckPermissions = (...permissions: string[]) => {
    return SetMetadata(PERMISSIONS_KEY, permissions)
}