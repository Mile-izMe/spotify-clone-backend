/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ExecutionContext,
    Injectable,
} from "@nestjs/common"
import {
    GqlExecutionContext,
} from "@nestjs/graphql"
import {
    AuthGuard,
} from "@nestjs/passport"

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }

    handleRequest(err: any, user: any) {
        if (err) {
            return null
        }

        return user ?? null
    }
}