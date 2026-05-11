## WebSocket Architecture

### 1. Overview
This module is built on **Socket.IO** and uses a **Redis adapter** for horizontal scaling.
The main WebSocket logic is centralized in `WebsocketModule` and exposed via `WebsocketService`.

### 2. What This Module Provides
- **Cross-instance emit support** through Redis adapter.
- **Cluster message bus** via Redis Pub/Sub.
- **User-targeted emit** with room pattern `user:{userId}`.
- **Service-driven API** so any Nest service can push real-time events.

### 3. Initialization Flow

#### Phase A: Module Registration
Register `WebsocketModule` in your root module (currently configured as global in the app):

```ts
WebsocketModule.register({
	isGlobal: true,
	// namespace?: "/music",
	// roomPrefix?: "ws",
	// useRedisAdapter?: true,
})
```

#### Phase B: Gateway Bootstrapping (`afterInit`)
When the gateway starts:
1. Duplicate the Redis adapter connection into `pubClient` and `subClient`.
2. Connect both clients.
3. Attach Socket.IO Redis adapter: `server.adapter(createAdapter(pubClient, subClient))`.
4. Pass the Socket.IO server instance to `WebsocketService` with `setServer(server)`.

This makes `server.to(...).emit(...)` work across multiple app instances.

#### Phase C: Service Pub/Sub Bootstrapping (`onModuleInit`)
When `WebsocketService` initializes:
1. Duplicate Redis connections for internal publish/subscribe.
2. Connect both internal clients (`pub`, `sub`).
3. Subscribe to global channel: `{roomPrefix || "ws"}:bus`.
4. For each incoming message:
	 - Parse payload JSON.
	 - If `recipients` exists, emit to each `user:{userId}` room.
	 - If `recipients` is empty, broadcast to all clients.
	 - Re-emit locally through an internal `EventEmitter` for backend listeners.

### 4. Runtime Usage

#### A. Emit to a Single User
Use this when you already know the target user ID:

```ts
this.websocketService.emitToUser(userId, "songs.updated", {
	songId,
	status: "ready",
})
```

Behavior:
- Emits to room `user:{userId}`.
- Works for all sockets currently joined to that room.
- With Redis adapter enabled, this is synchronized across instances.

#### B. Broadcast Through Cluster Bus
Use this when another instance or worker should also receive/process the event:

```ts
await this.websocketService.broadcastToCluster({
	event: "notify.new",
	recipients: ["u1", "u2"],
	data: { title: "New release" },
})
```

If `recipients` is omitted or empty, the event is broadcast to all connected clients.

#### C. Publish to a Custom Redis Channel
Use `publish(channel, data)` for custom channels outside the default bus:

```ts
await this.websocketService.publish("ws:songs:updated", {
	songId,
	updatedAt: Date.now(),
})
```

#### D. Listen to Internal Backend Events
Other backend modules can subscribe through `WebsocketService.on(...)`:

```ts
this.websocketService.on("songs.updated", (payload) => {
	// handle event inside backend module
})
```

### 5. Connection and Room Conventions
- Gateway transport is configured as `websocket`.
- User room convention is `user:{userId}`.
- Global bus channel convention is `{roomPrefix || "ws"}:bus`.

### 6. Important Note About Authentication
This module includes the `AuthenticatedSocket` type and `@WsUser()` decorator, but handshake authentication and room-join logic must be implemented in your gateway handlers/middleware.

Recommended flow:
1. Validate token during handshake.
2. Attach user context to `client.user`.
3. Join room `user:{userId}` after successful authentication.

### 7. Shutdown Flow
On module destroy, `WebsocketService` gracefully closes Redis pub/sub clients via `quit()`.