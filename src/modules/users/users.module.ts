import {
    Module 
} from "@nestjs/common"
import {
    UserService 
} from "./user.service"
import {
    PrismaService 
} from "@modules/databases"

@Module({
    providers: [UserService,
        PrismaService],
    exports: [UserService],
})
export class UsersModule {}
