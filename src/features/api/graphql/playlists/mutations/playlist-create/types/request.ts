import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType()
export class PlaylistCreateRequest {
    @Field(() => String)
        name: string
}
