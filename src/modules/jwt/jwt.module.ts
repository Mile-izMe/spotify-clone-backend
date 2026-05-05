import {
    Module
} from "@nestjs/common"
import {
    JwtConfigurableModuleClass
} from "./jwt.module-definition"
import {
    JwtService 
} from "./jwt.service"

@Module({
    providers: [
        JwtService,
    ],
    exports: [
        JwtService,
    ],
})
export class JwtModule extends JwtConfigurableModuleClass {}