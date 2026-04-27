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
    ],
    exports: [
        SongPresignUrlService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
