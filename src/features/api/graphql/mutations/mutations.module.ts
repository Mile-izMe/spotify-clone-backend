import {
    Module,
} from "@nestjs/common"
import {
    MutationConfigurableModuleClass 
} from "./mutations.module-defintion"


@Module({
    imports: [

    ],
})
export class MutationsModule extends MutationConfigurableModuleClass {}
