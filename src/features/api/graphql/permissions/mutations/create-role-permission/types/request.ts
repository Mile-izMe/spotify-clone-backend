import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for assigning permissions to one or many roles.",
})
export class CreateRolePermissionRequest {
    @Field(() => [String], {
        description: "Role identifiers.",
    })
        roleIds: Array<string>

    @Field(() => [String], {
        description: "Permission identifiers.",
    })
        permissionIds: Array<string>
}
