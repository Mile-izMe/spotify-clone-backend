import {
    Field,
    InputType,
    Int,
} from "@nestjs/graphql"

@InputType({
    description: "Request for updating song fields.",
})
export class SongUpdateRequest {
    @Field(() => String, {
        description: "Song id.",
    })
        id: string

    @Field(() => String, {
        nullable: true,
        description: "Song title.",
    })
        title?: string

    @Field(() => String, {
        nullable: true,
        description: "Song artist.",
    })
        artist?: string

    @Field(() => String, {
        nullable: true,
        description: "Audio URL or object key.",
    })
        audioUrl?: string

    @Field(() => String, {
        nullable: true,
        description: "Optional thumbnail URL or key.",
    })
        thumbnailUrl?: string

    @Field(() => Int, {
        nullable: true,
        description: "Optional duration in milliseconds.",
    })
        duration?: number
}