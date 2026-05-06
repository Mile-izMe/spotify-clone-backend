import {
    Module,
} from "@nestjs/common"
import {
    QueriesModule
} from "./queries"
import {
    UserConfigurableModuleClass
} from "./user.module.definition"
import {
    UserResolver
} from "./user.resolver"

@Module({
    imports: [
        QueriesModule,
    ],
    providers: [
        UserResolver,
    ]
})
export class UserModule extends UserConfigurableModuleClass {}
