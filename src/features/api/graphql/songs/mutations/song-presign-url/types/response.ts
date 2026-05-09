import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType
} from "@nestjs/graphql"



@ObjectType()
export class SongPresignUrlResponseData {
    @Field(() => String,
        {
            description: "Generated object key to store in database after upload.",
        })
        key: string

    @Field(() => String,
        {
            description: "Presigned PUT URL used by the client to upload the file.",
        })
        url: string
}

@ObjectType()
export class SongPresignUrlResponse extends AbstractGraphQLResponse {
    @Field(() => SongPresignUrlResponseData,
        {
            nullable: true,
        })
        data?: SongPresignUrlResponseData | null
}
