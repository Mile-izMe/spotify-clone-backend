import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass,
} from "./query.module.definition"
import {
    GetMyPlaylistsHandler,
    GetMyPlaylistsService,
} from "./my-playlists"
import {
    GetPlaylistSongsHandler,
    PlaylistSongsService,
} from "./playlist-songs"

@Module({
    imports: [],
    providers: [
        GetMyPlaylistsHandler,
        GetMyPlaylistsService,
        GetPlaylistSongsHandler,
        PlaylistSongsService,
    ],
    exports: [
        GetMyPlaylistsService,
        PlaylistSongsService,
    ],
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
