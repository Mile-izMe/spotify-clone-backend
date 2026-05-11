export interface WebsocketModuleOptions {
    /**
    * The namespace for the WebSocket connection (/music, /chat).
    */
    namespace?: string

    /**
    * The prefix for the WebSocket room names. This can be used to avoid collisions with other modules that use WebSockets.
    */
    roomPrefix?: string

    /**
    * Whether to enable Redis for WebSocket scaling. If enabled, the module will use Redis to broadcast messages across multiple instances of the application.
    */
    useRedisAdapter?: boolean
}