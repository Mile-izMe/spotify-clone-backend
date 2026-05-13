// import {
//     Field, ObjectType 
// } from "@nestjs/graphql"
// import {
//     PlaylistResponseData 
// } from "../playlists/types"
// import {
//     SongsResponseDataObject 
// } from "../../songs/queries/songs/types"

// @ObjectType()
// export class GlobalSearchResponseData {
//     @Field(() => [SongsResponseDataObject], {
//         description: "Danh sách bài hát tìm được" 
//     })
//         songs: SongsResponseDataObject[]

//     @Field(() => [UserResponseData], {
//         description: "Danh sách nghệ sĩ/người dùng tìm được" 
//     })
//         users: UserResponseData[]

//     @Field(() => [PlaylistResponseData], {
//         description: "Danh sách danh sách phát tìm được" 
//     })
//         playlists: PlaylistResponseData[]
// }