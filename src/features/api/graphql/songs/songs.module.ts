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
import {
    SongsPublicResolver 
} from "./songs-public.resolver"

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
        SongsPublicResolver
    ]
})
export class SongsModule extends SongsConfigurableModuleClass {}
