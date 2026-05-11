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

@Module({
    providers: [
        WebsocketService,
        AppWebSocketGateway
    ],
    exports: [
        WebsocketService,
    ],
})
export class WebsocketModule extends WebsocketConfigurableModuleClass {}
