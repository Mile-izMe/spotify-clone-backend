import {
    GetUserByIdRequest,
} from "./types"

export interface GetUserByIdQueryParams {
    request: GetUserByIdRequest
}

export class GetUserByIdQuery {
    constructor(
        readonly params: GetUserByIdQueryParams,
    ) {}
}
