import {
    Module,
} from "@nestjs/common"
import {
    ApiConfigurableModuleClass
} from "./api.module-definition"

/**
 * Module for the GraphQL.
 */
@Module({
    imports: [
    ],
})
export class HttpModule extends ApiConfigurableModuleClass {}
