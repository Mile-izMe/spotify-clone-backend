import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    PlaylistItem,
} from "../../../types"
import {
    SongItem,
} from "../../../../songs/types"

@ObjectType()
export class PlaylistSongsResponseDataObject {
    @Field(() => PlaylistItem)
        playlist: PlaylistItem

    @Field(() => [SongItem])
        songs: Array<SongItem>
}

@ObjectType()
export class PlaylistSongsResponse extends AbstractGraphQLResponse {
    @Field(() => PlaylistSongsResponseDataObject, {
        nullable: true,
    })
        data?: PlaylistSongsResponseData | null
}

export interface PlaylistSongsResponseData {
    playlist: PlaylistItem
    songs: Array<SongItem>
}
