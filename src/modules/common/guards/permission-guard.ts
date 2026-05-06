import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable 
} from "@nestjs/common"
import {
    Reflector 
} from "@nestjs/core"
import {
    PERMISSIONS_KEY 
} from "../types"

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Get the required permissions from Decorator
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass()
            ])

        // If no specfic requirements, allow access (pass AuthGuard only)
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true
        }

        // Check if the user has the required permissions
        // Get user information from Request (from Passport attached when verifying JWT token)
        const user = context.switchToHttp().getRequest()
        if (!user || !user.permissions) {
            throw new ForbiddenException("User does not have permissions to access this resource")
        }

        // Check if user has enough permissions 
        // "At least 1 permission" (some) or "All permissions" (every)
        const hasPermission = requiredPermissions.every((permission) => 
            user.permissions.includes(permission)
        )
        
        if (!hasPermission) {
            throw new ForbiddenException("Permissions insufficient to access this resource")
        }

        return true
    }
}