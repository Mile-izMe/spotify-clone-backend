import {
    InputType, Field 
} from "@nestjs/graphql"

@InputType({
    description: "Request for generating a presigned URL to upload a song file.",
})
export class SongPresignUrlRequest {
    @Field(() => String,
        {
            description: "MIME type of the file to upload.",
        })
        contentType: string

    @Field(() => String,
        {
            nullable: true,
            description: "Optional original file name used to keep the extension.",
        })
        fileName?: string
}