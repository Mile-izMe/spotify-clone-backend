import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetUserByEmailQuery,
    GetUserByEmailQueryParams,
} from "./get-user-by-email.query"
import {
    GetUserByEmailResponseData,
} from "./types"

@Injectable()
export class GetUserByEmailService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: GetUserByEmailQueryParams,
    ): Promise<GetUserByEmailResponseData> {
        return this.queryBus.execute(
            new GetUserByEmailQuery(params),
        )
    }
}
