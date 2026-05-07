import {
    Module,
} from "@nestjs/common"
import {
    AuthService,
} from "../auth.service"
import {
    LoginHandler,
    LoginService,
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
        AuthService,
        LoginHandler,
        LoginService,
        SongSaveMetadataHandler,
        SongSaveMetadataService,
    ],
    exports: [
        AuthService,
        LoginService,
        SongSaveMetadataService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
