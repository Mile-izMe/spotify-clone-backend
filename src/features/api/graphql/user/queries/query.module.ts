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

@Module({
    imports: [],
    providers: [
        GetUserByIdHandler,
        GetUserByIdService,
    ],
    exports: [
        GetUserByIdService,
    ]
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
