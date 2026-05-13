// // global-search.query.ts
// export class GlobalSearchQuery {
//     constructor(public readonly params: GlobalSearchRequestParams) {}
// }

// // global-search.handler.ts
// import {
//     Injectable 
// } from "@nestjs/common"
// import {
//     IQueryHandler, QueryHandler 
// } from "@nestjs/cqrs"
// import {
//     ElasticsearchService 
// } from "@modules/elasticsearch/elasticsearch.service"
// import {
//     ICQRSHandler 
// } from "@modules/cqrs"
// import {
//     GlobalSearchQuery 
// } from "./global-search.query"
// import {
//     GlobalSearchResponseData 
// } from "./global-search.types"

// @QueryHandler(GlobalSearchQuery)
// @Injectable()
// export class GlobalSearchHandler 
//     extends ICQRSHandler<GlobalSearchQuery, GlobalSearchResponseData> 
//     implements IQueryHandler<GlobalSearchQuery, GlobalSearchResponseData> {
    
//     constructor(private readonly elasticsearchService: ElasticsearchService) {
//         super()
//     }

//     protected override async process(
//         query: GlobalSearchQuery,
//     ): Promise<GlobalSearchResponseData> {
//         const { keyword, limit = 5 } = query.params

//         // Nếu keyword rỗng, trả về mảng rỗng để tiết kiệm tài nguyên
//         if (!keyword || keyword.trim() === "") {
//             return {
//                 songs: [], users: [], playlists: [] 
//             }
//         }

//         // Bắn 3 luồng Search CÙNG LÚC vào Elasticsearch
//         const [songsResult,
//             usersResult,
//             playlistsResult] = await Promise.all([
//             this.elasticsearchService.search<any>("Song", { 
//                 keyword, from: 0, size: limit 
//             }),
//             this.elasticsearchService.search<any>("User", { 
//                 keyword, from: 0, size: limit 
//             }),
//             this.elasticsearchService.search<any>("Playlist", { 
//                 keyword, from: 0, size: limit 
//             })
//         ])

//         return {
//             songs: songsResult.data,
//             users: usersResult.data,
//             playlists: playlistsResult.data,
//         }
//     }
// }