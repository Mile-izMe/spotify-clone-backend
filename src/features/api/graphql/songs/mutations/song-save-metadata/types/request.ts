import {
    Field,
    InputType,
    Int,
} from "@nestjs/graphql"

@InputType({
    description: "Request for saving song metadata after uploading the file.",
})
export class SongSaveMetadataRequest {
    @Field(() => String,
        {
            description: "The uploaded file key returned by the presign mutation.",
        })
        key: string

    @Field(() => String,
        {
            description: "Song title.",
        })
        title: string

    @Field(() => String,
        {
            description: "Song artist.",
        })
        artist: string

    @Field(() => String,
        {
            nullable: true,
            description: "Optional thumbnail URL or key.",
        })
        thumbnailUrl?: string

    @Field(() => Int,
        {
            nullable: true,
            description: "Optional song duration in milliseconds.",
        })
        duration?: number
}
