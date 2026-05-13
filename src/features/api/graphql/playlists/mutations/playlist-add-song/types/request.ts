import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType()
export class PlaylistAddSongRequest {
    @Field(() => String)
        playlistId: string

    @Field(() => String)
        songId: string
}
