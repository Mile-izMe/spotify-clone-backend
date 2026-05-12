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
    JwtStrategy
} from "@modules/common/strategies/jwt-strategy"
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
        JwtStrategy,
    ]
})
export class AuthModule extends AuthConfigurableModuleClass {}
