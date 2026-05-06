import {
    Injectable 
} from "@nestjs/common"
import {
    PrismaService 
} from "@modules/databases"

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                username: email 
            } 
        })
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id 
            } 
        })
    }
}
