import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass 
} from "./queries.module-defintion"


@Module({
    imports: [

    ],
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
