import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    SongItem,
} from "../../../queries/songs/types"

@ObjectType()
export class SongSaveMetadataResponseData {
    @Field(() => SongItem)
        song: SongItem
}

@ObjectType()
export class SongSaveMetadataResponse extends AbstractGraphQLResponse {
    @Field(() => SongSaveMetadataResponseData)
        data: SongSaveMetadataResponseData
}
