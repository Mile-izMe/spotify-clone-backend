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
export class PlaylistCreateResponseDataObject {
    @Field(() => PlaylistItem)
        playlist: PlaylistItem
}

@ObjectType()
export class PlaylistCreateResponse extends AbstractGraphQLResponse {
    @Field(() => PlaylistCreateResponseDataObject, {
        nullable: true,
    })
        data?: PlaylistCreateResponseData | null
}

export interface PlaylistCreateResponseData {
    playlist: PlaylistItem
}
