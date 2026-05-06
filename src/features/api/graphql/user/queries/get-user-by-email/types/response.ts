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
export class GetUserByEmailResponseDataObject {
    @Field(() => UserItem,
        {
            nullable: true 
        })
        data?: UserItem | null
}

@ObjectType()
export class GetUserByEmailResponse extends AbstractGraphQLResponse {
    @Field(() => GetUserByEmailResponseDataObject,
        {
            nullable: true 
        })
        data?: GetUserByEmailResponseDataObject | null
}

export interface GetUserByEmailResponseData {
    data?: UserItem | null
}
