import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    SongItem,
} from "../../../types"

@ObjectType()
export class SongSaveMetadataResponseData {
    @Field(() => SongItem)
        song: Omit<SongItem, "isEditable" | "createdAt" | "updatedAt">
}

@ObjectType()
export class SongSaveMetadataResponse extends AbstractGraphQLResponse {
    @Field(() => SongSaveMetadataResponseData,
        {
            nullable: true,
        })
        data?: SongSaveMetadataResponseData | null
}
