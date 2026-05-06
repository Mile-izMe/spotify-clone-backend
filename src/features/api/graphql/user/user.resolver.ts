import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    Locale,
} from "@modules/databases"
import {
    UseInterceptors,
} from "@nestjs/common"
import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    GetUserByIdService,
} from "./queries/get-user-by-id/get-user-by-id.service"
import {
    GetUserByIdRequest,
    GetUserByIdResponse,
    GetUserByIdResponseData,
} from "./queries/get-user-by-id/types"

@Resolver()
export class UserResolver {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
    ) { }

    @GraphQLSuccessMessage({
        [Locale.En]: "User fetched successfully",
        [Locale.Vi]: "Lấy thông tin người dùng thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(() => GetUserByIdResponse,
        {
            name: "getUserById",
            description: "Fetch a user by id and return all fields.",
        })
    async execute(
        @Args("request",
            {
                description: "Request containing the user id." 
            })
            request: GetUserByIdRequest,
    ): Promise<GetUserByIdResponseData> {
        return this.getUserByIdService.execute({
            request 
        })
    }
}
