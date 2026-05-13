import {
    Field,
    Int,
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    SongItem,
} from "../../../types"

@ObjectType()
export class SongsResponseDataObject {
    @Field(() => Int)
        count: number

    @Field(() => String,
        {
            nullable: true,
        })
        cursor?: string

    @Field(() => [SongItem])
        data: Array<SongItem>
}

@ObjectType()
export class SongsResponse extends AbstractGraphQLResponse {
    @Field(() => SongsResponseDataObject,
        {
            nullable: true,
        })
        data?: SongsResponseDataObject | null
}

export interface SongsResponseData {
    count: number 
    cursor?: string
    data: Array<SongItem>
}