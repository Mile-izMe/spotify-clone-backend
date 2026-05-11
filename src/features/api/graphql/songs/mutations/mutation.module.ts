import {
    Module,
} from "@nestjs/common"
import {
    SongPresignUrlHandler 
} from "./song-presign-url/song-presign-url.handler"
import {
    SongPresignUrlService 
} from "./song-presign-url"
import {
    SongUpdateHandler,
    SongUpdateService,
} from "./song-update"
import {
    SongSaveMetadataHandler,
    SongSaveMetadataService,
} from "./song-save-metadata"
import {
    MutationsConfigurableModuleClass 
} from "./mutation.module-definition"


/**
 * Module for the Mutations.
 */
@Module({
    imports: [],
    providers: [
        SongPresignUrlHandler,
        SongPresignUrlService,
        SongUpdateHandler,
        SongUpdateService,
        SongSaveMetadataHandler,
        SongSaveMetadataService,
    ],
    exports: [
        SongPresignUrlService,
        SongUpdateService,
        SongSaveMetadataService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
