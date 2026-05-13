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

@ObjectType()
export class PlaylistAddSongResponseDataObject {
    @Field(() => PlaylistItem)
        playlist: PlaylistItem
}

@ObjectType()
export class PlaylistAddSongResponse extends AbstractGraphQLResponse {
    @Field(() => PlaylistAddSongResponseDataObject, {
        nullable: true,
    })
        data?: PlaylistAddSongResponseData | null
}

export interface PlaylistAddSongResponseData {
    playlist: PlaylistItem
}
