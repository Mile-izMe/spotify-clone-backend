## Authentication Flow (Register, Login & Refresh Token Rotation)

1. Architecturing (Multi-level Caching)
* Layer 1: Redis -> Store plaintext token => O(1): Serving fast query, reuse detection
* Layer 2: Db (persistent) -> Store hash token => Security

2. Login:
   1. Verify: Check email and verify password
   2. Generate Token: AccessToken and RefreshToken
   3. Sync Data:
    - Save RT with Redis key: rt:{userId}:{deviceId}
    - Hash RT by SHA-256
    - Upsert RT hash into db
   4. Return both token to users

3. Refresh Token Rotation:
# Step 1: Reuse Dectection
- When client send raw RT to get new AT:
    - Get raw RT from Redis
    - Compare: If request RT *different* from latest RT in Redis => Warning Attack
    - CTA: Delete all data related RT in Redis and DB => Force login again

# Step 2: Issue New Tokens (Normal Rotation)
- If Redis shows the incoming raw RT equals the latest stored RT:
   - Verify RT hash against the DB-stored hash (SHA-256). If mismatch, treat as attack.
   - Generate a new Access Token (AT) and a new Refresh Token (RT').
   - Persist rotation:
      - Save raw RT' in Redis key `rt:{userId}:{deviceId}` as the latest token.
      - Hash RT' and upsert the hash into the DB for audit / persistent validation.
   - Return the new tokens to the client. Old RT (the one just used) is superseded.

# Step 3: Reuse Detection Remediation
- If reuse is detected (an older RT or a non-latest RT is presented):
   - Consider this a potential refresh-token theft.
   - Revoke all sessions for that user/device:
      - Delete related Redis keys (all `rt:{userId}:*`).
      - Remove or mark as revoked the RT hashes in DB for those sessions.
   - Force re-authentication: require user to login again and reissue new credentials.

# Step 4: Logout / Revocation
- When a user explicitly logs out from a device:
   - Delete the Redis key `rt:{userId}:{deviceId}`.
   - Optionally insert the raw AT into a short-lived blacklist in Redis (by jti) until the AT expiry.
   - Remove or mark the RT hash as revoked in DB.

# Step 5: Device / Session Management
- Store session metadata alongside each refresh token (deviceId, ip, user-agent, createdAt).
- Allow users to list and revoke active device sessions: revocation performs the same cleanup above.

---

## Control Flow (When you call any API)

This is where `Guards`, `Strategy` and `Decorator` work together as a layered security team.

### Layer 1: Passport & `JwtStrategy` (Security Gate)

When a request includes an AT in the header `Authorization: Bearer <token>`:

- Passport validates the token signature and expiration using `secretOrKey`.
- If validation succeeds, Passport calls `validate()` inside `JwtStrategy`.
- Inside `validate()` do additional checks:
   - Check Blacklist: consult Redis to see if this token (or its `jti`) is blacklisted due to logout or revocation.
   - If blacklisted, throw an unauthorized error.
   - If clean, return a User object (with `id`, `permissions`, etc.). Passport attaches that object to `req.user`.

### Layer 2: `JwtAuthGuard` (Gatekeeper)

- `JwtAuthGuard` extends the Passport guard.
- Its job: if `req.user` is absent (Layer 1 failed), throw `401 Unauthorized` with message: "Your session has expired or is invalid. Please login again.".

### Layer 3: `CheckPermissions` & `PermissionsGuard` (VIP Access Control)

- `@CheckPermissions('user:delete')` is a decorator that marks the route as requiring the `user:delete` permission.
- `PermissionsGuard` reads `req.user.permissions` (populated by Layer 1 from the JWT payload or DB) and compares:
   - If the user's permissions contain `user:delete`, allow the request.
   - Otherwise, throw `403 Forbidden`.

---

Notes / Best Practices:
- Keep tokens small: store minimal claims (user id, jti, expiry, permissions reference) and fetch fresh permissions from DB when needed.
- Use short-lived ATs (minutes) and longer RTs (days) with rotation for security.
- Log suspicious events (reuse detection, multiple failed refresh attempts) for monitoring and incident response.