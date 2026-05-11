import {
    Module,
} from "@nestjs/common"
import {
    WebsocketService,
} from "./websocket.service"
import {
    WebsocketConfigurableModuleClass,
} from "./websocket.module-definition"
import {
    AppWebSocketGateway 
} from "./gateway"
import {
    JwtService 
} from "@nestjs/jwt"

@Module({
    providers: [
        WebsocketService,
        AppWebSocketGateway,
        JwtService
    ],
    exports: [
        WebsocketService,
    ],
})
export class WebsocketModule extends WebsocketConfigurableModuleClass {}
