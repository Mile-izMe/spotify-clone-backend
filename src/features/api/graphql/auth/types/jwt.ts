export interface JwtPayload {
  sub: string;         // User ID
  username: string;    // Username (for convenience, can be omitted if not needed)
  roles: string[];     // Array of roles (RBAC)
  permissions: string[]; // Array of permissions (Fine-grained RBAC)
  deviceId: string;    // Handle Rotation
}