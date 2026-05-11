import {
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    RegisterCommand,
} from "./register.command"
import {
    RegisterResponseData,
} from "./types"
import {
    HashService 
} from "@modules/hash/hash.service"

@CommandHandler(RegisterCommand)
@Injectable()
export class RegisterHandler
    extends ICQRSHandler<RegisterCommand, RegisterResponseData>
    implements ICommandHandler<RegisterCommand, RegisterResponseData> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: HashService
    ) {
        super()
    }

    protected override async process(
        command: RegisterCommand,
    ): Promise<RegisterResponseData> {
        const {
            request,
        } = command.params

        const hashedPassword = await this.hashService.hashPassword(request.password)

        const user = await this.prisma.user.create({
            data: {
                username: request.username,
                email: request.email,
                password: hashedPassword,
            },
        })

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    }
}
