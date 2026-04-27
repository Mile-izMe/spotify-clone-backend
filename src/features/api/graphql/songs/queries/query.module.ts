import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass
} from "./query.module-definition"
import {
    GetSongsHandler
} from "./songs/songs.handler"
import {
    GetSongsService
} from "./songs/songs.service"


/**
 * Module for the Queries.
 */
@Module({
    imports: [],
    providers: [
        GetSongsHandler,
        GetSongsService
    ],
    exports: [
        GetSongsService,
    ]
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
