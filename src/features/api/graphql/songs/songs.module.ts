import {
    Module,
} from "@nestjs/common"
import {
    MutationsModule
} from "./mutations"
import {
    QueriesModule 
} from "./queries"
import {
    SongsConfigurableModuleClass
} from "./songs.module.definition"
import {
    SongsResolver
} from "./songs.resolver"

/**
 * Module for the Songs.
 */
@Module({
    imports: [
        QueriesModule,
        MutationsModule,
    ],
    providers: [
        SongsResolver,
    ]
})
export class SongsModule extends SongsConfigurableModuleClass {}
