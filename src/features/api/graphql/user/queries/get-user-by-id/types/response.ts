import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
} from "@modules/api"

@ObjectType()
export class UserItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        username: string

    @Field(() => String)
        password: string

    @Field(() => Date)
        createdAt: Date

    @Field(() => String,
        {
            nullable: true 
        })
        createBy?: string | null

    @Field(() => Date)
        updatedAt: Date

    @Field(() => String,
        {
            nullable: true 
        })
        updateBy?: string | null
}

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
