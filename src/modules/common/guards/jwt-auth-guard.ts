/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ExecutionContext,
    Injectable, UnauthorizedException
} from "@nestjs/common"
import {
    GqlExecutionContext
} from "@nestjs/graphql"
import {
    AuthGuard
} from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }
    
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException("Your session has expired. Please log in again.")
        }
        return user
    }
}