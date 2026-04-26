import {
    Module,
} from "@nestjs/common"
import {
    ServicesModuleClass,
} from "./services.module-definition"
// import {
//     ValidateService,
// } from "./validate.service"
import {
    PaginateService,
} from "./paginate.service"

@Module({
    providers: [
        // ValidateService,
        PaginateService,
    ],
    exports: [
        // ValidateService,
        PaginateService,
    ],
})
export class ServicesModule extends ServicesModuleClass {
}
