/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayInit 
} from "@nestjs/websockets"
import {
    Server 
} from "socket.io"
import {
    RedisInstanceKey, InjectRedis 
} from "@modules/native/redis"
import {
    WebsocketService 
} from "../websocket.service"
import {
    createAdapter 
} from "@socket.io/redis-adapter"

@WebSocketGateway({
    cors: {
        origin: "*" 
    },
    transports: ["websocket"],
})
export class AppWebSocketGateway implements OnGatewayInit {
    @WebSocketServer() server: Server

    constructor(
        private readonly wsService: WebsocketService,
        @InjectRedis(RedisInstanceKey.Adapter)
        private readonly redisAdapterClient: any,
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
}