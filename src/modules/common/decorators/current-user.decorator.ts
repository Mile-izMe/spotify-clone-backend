import {
    createParamDecorator,
    ExecutionContext,
} from "@nestjs/common"
import {
    GqlExecutionContext,
} from "@nestjs/graphql"

export const CurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context)
        const request = gqlContext.getContext().req
        const user = request?.user

        if (!data) {
            return user
        }

        return user?.[data]
    },
)
