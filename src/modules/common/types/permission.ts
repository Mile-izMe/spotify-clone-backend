export const PERMISSIONS_KEY = "permissions"

export enum PermissionName {
	SongCreate = "song:create",
	SongUpdate = "song:update",
	GetRole = "role:get",
	GetUserPermissions = "user_permissions:get",
	CreatePermissions = "permissions:create",
	CreateRolePermission = "role_permission:create",
}