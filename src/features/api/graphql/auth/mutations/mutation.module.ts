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
    RegisterHandler,
    RegisterService,
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
        RegisterHandler,
        RegisterService,
    ],
    exports: [
        AuthService,
        LoginService,
        RegisterService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
