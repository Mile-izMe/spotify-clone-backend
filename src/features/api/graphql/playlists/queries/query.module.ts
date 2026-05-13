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

@Module({
    imports: [],
    providers: [
        GetMyPlaylistsHandler,
        GetMyPlaylistsService,
    ],
    exports: [
        GetMyPlaylistsService,
    ],
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
