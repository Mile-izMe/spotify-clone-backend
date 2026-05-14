import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    PermissionItem,
} from "../../../types"

@ObjectType()
export class GetPermissionsResponseDataObject {
    @Field(() => [PermissionItem])
        permissions: Array<PermissionItem>
}

@ObjectType()
export class GetPermissionsResponse extends AbstractGraphQLResponse {
    @Field(() => GetPermissionsResponseDataObject, {
        nullable: true,
    })
        data?: GetPermissionsResponseData | null
}

export interface GetPermissionsResponseData {
    permissions: Array<PermissionItem>
}
