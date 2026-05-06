import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType()
export class GetUserByIdRequest {
    @Field(() => String)
        id: string
}
