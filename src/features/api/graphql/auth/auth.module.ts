import {
    Module,
} from "@nestjs/common"
import {
    AuthConfigurableModuleClass
} from "./auth.module.definition"
import {
    AuthResolver
} from "./auth.resolver"
import {
    MutationsModule
} from "./mutations"
import {
    AuthService 
} from "./auth.service"
import {
    JwtModule 
} from "@nestjs/jwt"
import {
    PassportModule 
} from "@nestjs/passport"

/**
 * Module for the Auth.
 */
@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt" 
        }),
        JwtModule.register({
        }),
        MutationsModule,
    ],
    providers: [
        AuthResolver,
        AuthService,
    ]
})
export class AuthModule extends AuthConfigurableModuleClass {}
