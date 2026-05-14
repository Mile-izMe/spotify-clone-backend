import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetPermissionsQuery,
} from "./get-permissions.query"
import {
    GetPermissionsResponseData,
} from "./types"

@Injectable()
export class GetPermissionsService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(): Promise<GetPermissionsResponseData> {
        return this.queryBus.execute(
            new GetPermissionsQuery(),
        )
    }
}
