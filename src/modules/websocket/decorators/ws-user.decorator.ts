// decorators/ws-user.decorator.ts
import {
    createParamDecorator, ExecutionContext 
} from "@nestjs/common"
import {
    AuthenticatedSocket 
} from "../types/websocket"

export const WsUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        // Get object client from WebSocket's context
        const client = ctx.switchToWs().getClient<AuthenticatedSocket>()
    
        // If pass key (ex: @WsUser('userId')), return value of that key
        // Otherwise, return the entire user object
        return data ? client.user?.[data] : client.user
    },
)