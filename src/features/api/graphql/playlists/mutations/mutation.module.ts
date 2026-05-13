import {
    Module,
} from "@nestjs/common"
import {
    PlaylistAddSongHandler,
    PlaylistAddSongService,
} from "./playlist-add-song"
import {
    PlaylistCreateHandler,
    PlaylistCreateService,
} from "./playlist-create"
import {
    MutationsConfigurableModuleClass,
} from "./mutation.module.definition"

@Module({
    imports: [],
    providers: [
        PlaylistCreateHandler,
        PlaylistCreateService,
        PlaylistAddSongHandler,
        PlaylistAddSongService,
    ],
    exports: [
        PlaylistCreateService,
        PlaylistAddSongService,
    ],
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
