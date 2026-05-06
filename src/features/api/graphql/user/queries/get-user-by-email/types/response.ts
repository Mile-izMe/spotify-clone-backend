import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
} from "@modules/api"

@ObjectType()
export class GetUserByEmailItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        username: string

    @Field(() => String)
        email: string

    @Field(() => String)
        password: string

    @Field(() => Boolean)
        isActive: boolean

    @Field(() => String)
        status: string

    @Field(() => [String])
        roles: string[]

    @Field(() => [String])
        permissions: string[]

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
export class GetUserByEmailResponseDataObject {
    @Field(() => GetUserByEmailItem,
        {
            nullable: true 
        })
        data?: GetUserByEmailItem | null
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
    data?: GetUserByEmailItem | null
}
