import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    Int,
    ObjectType,
} from "@nestjs/graphql"
import {
    PlaylistItem,
} from "../../../types"

@ObjectType()
export class GetMyPlaylistsResponseDataObject {
    @Field(() => Int)
        count: number

    @Field(() => String,
        {
            nullable: true,
        })
        cursor?: string

    @Field(() => [PlaylistItem])
        data: Array<PlaylistItem>
}

@ObjectType()
export class GetMyPlaylistsResponse extends AbstractGraphQLResponse {
    @Field(() => GetMyPlaylistsResponseDataObject, {
        nullable: true,
    })
        data?: GetMyPlaylistsResponseDataObject | null
}

export interface GetMyPlaylistsResponseData {
    count: number
    cursor?: string
    data: Array<PlaylistItem>
}
