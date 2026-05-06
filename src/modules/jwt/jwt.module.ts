import {
    Module
} from "@nestjs/common"
import {
    JwtConfigurableModuleClass
} from "./jwt.module-definition"
import {
    AuthService 
} from "./jwt.service"

@Module({
    providers: [
        AuthService,
    ],
    exports: [
        AuthService,
    ],
})
export class JwtModule extends JwtConfigurableModuleClass {}