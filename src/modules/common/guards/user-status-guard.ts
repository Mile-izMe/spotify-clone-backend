import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable 
} from "@nestjs/common"
import {
    GqlExecutionContext 
} from "@nestjs/graphql"

@Injectable()
export class UserStatusGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context)
        const user = ctx.getContext().req.user
        if (!user?.isActive) {
            throw new ForbiddenException("Your account is not active. Please verify your email before continuing.")
        }
        return true
    }
}