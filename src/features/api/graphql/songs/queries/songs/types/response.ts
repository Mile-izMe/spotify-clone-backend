import {
    Field,
    Int,
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
} from "@modules/api"

@ObjectType()
export class SongItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        title: string

    @Field(() => String)
        artist: string

    @Field(() => String)
        audioUrl: string

    @Field(() => String,
        {
            nullable: true,
        })
        thumbnailUrl?: string | null

    @Field(() => Int,
        {
            nullable: true,
        })
        duration?: number | null

    @Field(() => Date)
        createdAt: Date

    @Field(() => Date)
        updatedAt: Date
}

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
    @Field(() => SongsResponseDataObject)
        data: SongsResponseDataObject
}

export interface SongsResponseData {
    count: number
    cursor?: string
    data: Array<SongItem>
}