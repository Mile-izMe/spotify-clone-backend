import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for fetching songs in a playlist.",
})
export class GetPlaylistSongsRequest {
    @Field(() => String, {
        description: "Playlist identifier.",
    })
        playlistId: string
}
