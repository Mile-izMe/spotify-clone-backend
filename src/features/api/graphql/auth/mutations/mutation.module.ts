import {
    Module,
} from "@nestjs/common"
import {
    SongPresignUrlHandler 
} from "./login/song-presign-url.handler"
import {
    SongPresignUrlService 
} from "./login"
import {
    SongSaveMetadataHandler,
    SongSaveMetadataService,
} from "./register"
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
        SongSaveMetadataHandler,
        SongSaveMetadataService,
    ],
    exports: [
        SongPresignUrlService,
        SongSaveMetadataService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
