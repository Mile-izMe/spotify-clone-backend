/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    envConfig
} from "@modules/env"
import {
    InjectRedis,
    RedisInstanceKey
} from "@modules/native/redis"
import {
    JwtService
} from "@nestjs/jwt"
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets"
import {
    createAdapter
} from "@socket.io/redis-adapter"
import {
    Server
} from "socket.io"
import {
    AuthenticatedSocket
} from "../types"
import {
    WebsocketService
} from "../websocket.service"

@WebSocketGateway({
    cors: {
        origin: "*" 
    },
    transports: ["websocket"],
})
export class AppWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    constructor(
        private readonly wsService: WebsocketService,
        @InjectRedis(RedisInstanceKey.Adapter)
        private readonly redisAdapterClient: any,
        private readonly jwtService: JwtService,
    ) {}

    async afterInit(server: Server) {
        // Setup Redis Adapter to synchronize Emit between different servers
        const pubClient = this.redisAdapterClient.duplicate()
        const subClient = this.redisAdapterClient.duplicate()

        await Promise.all([pubClient.connect(),
            subClient.connect()])

        // Attach adapter into socket.io
        server.adapter(createAdapter(pubClient, subClient))
        
        this.wsService.setServer(server)
    }

    async handleConnection(client: AuthenticatedSocket) {
        try {
            // Get token from handshake (Client: socket = io({ auth: { token: '...' } }))
            const token = client.handshake.auth?.token

            if(token) {
                try {
                    const payload = await this.jwtService.verifyAsync(token, {
                        secret: envConfig().auth.jwt.atSecret
                    })

                    // ASSIGN USER (Attach user information to socket for use with @WsUser decorator)
                    client.user = {
                        userId: payload.sub,
                        deviceId: payload.deviceId,
                        roles: payload.roles,
                    }

                    // JOIN ROOM (This is the "identification" step so the Service can find the user)
                    const userRoom = `user:${client.user.userId}`
                    await client.join(userRoom)
                    console.log(`Authenticated user ${client.user.userId} connected`)
                    return
                } catch (error: any) {
                    console.error("Invalid token", error.message)
                }
            }
            
            console.log(`Guest connected: ${client.id}`)
        } catch (err: any) {
            console.error("Auth failed, disconnecting...", err.message)
            client.disconnect()
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        console.log(`User ${client.user?.userId} disconnected`)
    }
}