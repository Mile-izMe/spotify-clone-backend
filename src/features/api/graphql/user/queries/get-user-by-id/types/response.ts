import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    UserItem,
} from "../../shared/user-item"

@ObjectType()
export class GetUserByIdResponseDataObject {
    @Field(() => UserItem,
        {
            nullable: true 
        })
        data?: UserItem | null
}

@ObjectType()
export class GetUserByIdResponse extends AbstractGraphQLResponse {
    @Field(() => GetUserByIdResponseDataObject,
        {
            nullable: true 
        })
        data?: GetUserByIdResponseDataObject | null
}

export interface GetUserByIdResponseData {
    data?: UserItem | null
}
