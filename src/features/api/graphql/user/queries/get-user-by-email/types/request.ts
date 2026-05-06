import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType()
export class GetUserByEmailRequest {
    @Field(() => String)
        email: string
}
