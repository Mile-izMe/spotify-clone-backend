/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    InjectRedis
} from "@modules/native"
import {
    RedisInstanceKey,
} from "@modules/native/redis/enums/instance-key"
import {
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common"
import {
    EventEmitter,
} from "events"
import {
    RedisClientType,
    RedisClusterType
} from "redis"
import {
    Server
} from "socket.io"
import {
    WsBusPayload,
    type WebsocketModuleOptions
} from "./types"
import {
    WEBSOCKET_OPTIONS_TOKEN
} from "./websocket.module-definition"

type AnyRedis = RedisClientType | RedisClusterType

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
    private server: Server
    private pub?: AnyRedis
    private sub?: AnyRedis
    private readonly emitter = new EventEmitter()

    constructor(
        @Inject(WEBSOCKET_OPTIONS_TOKEN)
        private readonly options: WebsocketModuleOptions,

        @InjectRedis(RedisInstanceKey.Adapter)
        private readonly redisClient: AnyRedis
    ) {
        ICQRSHandler.setWebsocketPublisher(this)
    }

    setServer(server: Server) {
        this.server = server
    }

    /**
     * Proxy events from Redis pub/sub to an internal EventEmitter.
     * @param event 
     * @param listener 
     */
    on(event: string | symbol, listener: (...args: unknown[]) => void) {
        this.emitter.on(event, listener)
    }

    async onModuleInit() {
        try {
            // 1. Init Pub/Sub by duplicate from current connection
            // Note: node-redis require seperate connection for Subscribe
            this.pub = (this.redisClient as any).duplicate()
            this.sub = (this.redisClient as any).duplicate()

            await Promise.all([
                this.pub!.connect(),
                this.sub!.connect()
            ])

            // 2. Register default channels (Use prefix from config)
            const globalChannel = `${this.options.roomPrefix || "ws"}:bus`
            
            await (this.sub as any).subscribe(globalChannel, (message: string) => {
                try {
                    const payload: WsBusPayload = JSON.parse(message)
                
                    // Redirect from payload
                    if (payload.recipients && payload.recipients.length > 0) {
                        // Send to specific users
                        payload.recipients.forEach(uid => {
                            this.emitToUser(uid, payload.event, payload.data)
                        })
                    } else {
                        // Broadcast to systems
                        this.server.emit(payload.event, payload.data)
                    }

                    // Internal emitter if another modules BE to listen
                    this.emitter.emit(payload.event, payload.data)
                
                } catch (err) {
                    console.error("Failed to process cluster message", err)
                }
            })
        } catch (err) {
            console.warn("WebsocketService: Redis Pub/Sub setup failed", err)
        }
    }

    /**
     * Broadcast a message to all instances in the cluster (SongService, AuthService).
     * @param payload 
     */
    async broadcastToCluster(payload: WsBusPayload) {
        const globalChannel = `${this.options.roomPrefix || "ws"}:bus`
        await this.publish(globalChannel, payload)
    }

    /**
     * Publish a message to a Redis channel. The message will be forwarded to all subscribers, including this instance if subscribed.
     * @param channel 
     * @param data 
     */
    async publish(channel: string, data: unknown) {
        try {
            const message = typeof data === "string" ? data : JSON.stringify(data)
            if (this.pub) {
                await (this.pub as unknown as RedisClientType).publish(channel, message)
            }
        } catch (err) {
            console.warn("WebsocketService: publish failed", err)
        }
    }

    /**
     * Emit an event to all WebSocket clients in a user-specific room. The room name is expected to be `user:${userId}`. This allows targeting messages to specific users across multiple server instances.
     * @param userId 
     * @param event 
     * @param data 
     */
    emitToUser(userId: string, event: string, data: any) {
        if (this.server) {
            this.server.to(`user:${userId}`).emit(event, data)
        }
    }

    async onModuleDestroy() {
        try {
            ICQRSHandler.setWebsocketPublisher(undefined)

            if (this.sub) {
                await (this.sub as unknown as RedisClientType).quit()
            }
            if (this.pub) {
                await (this.pub as unknown as RedisClientType).quit()
            }
        } catch {
            // ignore
        }
    }
}
