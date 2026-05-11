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
export class SongUpdateResponseData {
    @Field(() => SongItem)
        song: SongItem
}

@ObjectType()
export class SongUpdateResponse extends AbstractGraphQLResponse {
    @Field(() => SongUpdateResponseData, {
        nullable: true,
    })
        data?: SongUpdateResponseData | null
}