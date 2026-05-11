import {
    Module
} from "@nestjs/common"
import {
    RequestContextService 
} from "./request-context.service"
import {
    ContextModuleClass 
} from "./context.module-defintion"

@Module({
    providers: [RequestContextService],
    exports: [RequestContextService],
})
export class ContextModule extends ContextModuleClass {}