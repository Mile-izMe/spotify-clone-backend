import {
    GetUserByEmailRequest,
} from "./types"

export interface GetUserByEmailQueryParams {
    request: GetUserByEmailRequest
}

export class GetUserByEmailQuery {
    constructor(
        readonly params: GetUserByEmailQueryParams,
    ) {}
}
