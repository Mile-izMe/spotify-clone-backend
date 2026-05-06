import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass
} from "./query.module.definition"
import {
    GetUserByIdHandler
} from "./get-user-by-id/get-user-by-id.handler"
import {
    GetUserByIdService
} from "./get-user-by-id/get-user-by-id.service"
import {
    GetUserByEmailHandler,
} from "./get-user-by-email/get-user-by-email.handler"
import {
    GetUserByEmailService,
} from "./get-user-by-email/get-user-by-email.service"

@Module({
    imports: [],
    providers: [
        GetUserByIdHandler,
        GetUserByIdService,
        GetUserByEmailHandler,
        GetUserByEmailService,
    ],
    exports: [
        GetUserByIdService,
        GetUserByEmailService,
    ]
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
