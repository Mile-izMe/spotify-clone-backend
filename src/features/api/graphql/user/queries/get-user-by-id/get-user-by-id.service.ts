import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetUserByIdQuery,
    GetUserByIdQueryParams,
} from "./get-user-by-id.query"
import {
    GetUserByIdResponseData,
} from "./types"

@Injectable()
export class GetUserByIdService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: GetUserByIdQueryParams,
    ): Promise<GetUserByIdResponseData> {
        return this.queryBus.execute(
            new GetUserByIdQuery(params),
        )
    }
}
