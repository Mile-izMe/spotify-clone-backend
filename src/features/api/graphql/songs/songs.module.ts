import {
    Module,
} from "@nestjs/common"
import {
    SongsConfigurableModuleClass
} from "./songs.module.definition"
import {
    GetSongsHandler 
} from "./queries/songs.handler"
import {
    SongsResolver 
} from "./songs.resolver"
import {
    GetSongsService 
} from "./queries/songs.service"

/**
 * Module for the Songs.
 */
@Module({
    imports: [],
    providers: [
        GetSongsHandler,
        GetSongsService,
        SongsResolver,
    ]
})
export class SongsModule extends SongsConfigurableModuleClass {}
