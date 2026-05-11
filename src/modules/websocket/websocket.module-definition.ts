
import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"
import {
    WebsocketModuleOptions 
} from "./types"

export const {
    ConfigurableModuleClass: WebsocketConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: WEBSOCKET_OPTIONS_TOKEN, 
    OPTIONS_TYPE: WEBSOCKET_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder<WebsocketModuleOptions>().setExtras({
        isGlobal: false
    },
    (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
    })
    ).build()
