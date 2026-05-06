import {
    Field,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class UserItem {
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
