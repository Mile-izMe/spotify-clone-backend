import {
    Module,
} from "@nestjs/common"
import {
    MutationsModule,
} from "./mutations"
import {
    QueriesModule,
} from "./queries"
import {
    PlaylistsConfigurableModuleClass,
} from "./playlists.module.definition"
import {
    PlaylistsResolver,
} from "./playlists.resolver"

@Module({
    imports: [
        QueriesModule,
        MutationsModule,
    ],
    providers: [
        PlaylistsResolver,
    ],
})
export class PlaylistsModule extends PlaylistsConfigurableModuleClass {}
