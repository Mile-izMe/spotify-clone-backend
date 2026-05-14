export const PERMISSIONS_KEY = "permissions"

export enum PermissionName {
	SongCreate = "song:create",
	SongUpdate = "song:update",
	GetRole = "role:get",
	GetPermissionByRole = "permission_by_role:get",
	GetAllPermissions = "permissions:get",
	CreatePermissions = "permissions:create",
	GetUserPermissions = "user_permissions:get",
	CreateRolePermission = "role_permission:create",

}