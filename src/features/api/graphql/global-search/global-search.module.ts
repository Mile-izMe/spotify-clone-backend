import {
    Module,
} from "@nestjs/common"
import {
    GlobalSearchConfigurableModuleClass
} from "./global-search.module.definition"
/**
 * Module for the Global Search.
 */
@Module({
    imports: [

    ],
    providers: [
        // GlobalSearchResolver,
    ]
})
export class GlobalSearchModule extends GlobalSearchConfigurableModuleClass {}
