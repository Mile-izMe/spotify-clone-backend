import {
    WsBusPayload 
} from "@modules/websocket"

type WebsocketPublisher = {
    broadcastToCluster(payload: WsBusPayload): Promise<void>
}

/**
 * Interface for a CQRS handler.
 * @template TParams - The parameters type.
 * @template TResponse - The response type.
 */
export abstract class ICQRSHandler<TParams, TResponse = unknown> {
    private static websocketPublisher?: WebsocketPublisher

    static setWebsocketPublisher(publisher?: WebsocketPublisher) {
        this.websocketPublisher = publisher
    }

    /**
     * Execute the handler.
     * @returns The response.
     */
    async execute(params: TParams): Promise<TResponse> {
        await this.validate(params)
        const response = await this.process(params)
        await this.emit(params,
            response)
        return response
    }

    /**
     * Validate the request.
     * @returns void.
     */
    protected async validate(params: TParams): Promise<void> {
        void params
    }

    /**
     * Process the request.
     * @param params - The parameters.
     * @returns The response.
     */
    protected abstract process(params: TParams): Promise<TResponse>

    /**
     * Emit the response.
     * @param request - The request.
     * @param response - The response.
     * @returns void.
     */
    protected async emit(request: TParams, response: TResponse): Promise<void> {
        const event = this.getWebsocketEvent(request, response)

        if (!event || !ICQRSHandler.websocketPublisher) {
            return
        }

        await ICQRSHandler.websocketPublisher.broadcastToCluster({
            event,
            recipients: this.getWebsocketRecipients(request, response),
            data: this.getWebsocketData(request, response),
        })
    }

    /**
     * Resolve the WebSocket event name for this handler.
     */
    protected getWebsocketEvent(_request: TParams, _response: TResponse): string | undefined {
        void _request
        void _response

        return undefined
    }

    /**
     * Resolve the WebSocket recipients for this handler.
     */
    protected getWebsocketRecipients(_request: TParams, _response: TResponse): string[] | undefined {
        void _request
        void _response

        return undefined
    }

    /**
     * Resolve the WebSocket payload data for this handler.
     */
    protected getWebsocketData(_request: TParams, response: TResponse): unknown {
        void _request

        return response
    }
}
