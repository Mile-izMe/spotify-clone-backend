import {
    Injectable, NestMiddleware
} from "@nestjs/common"
import {
    NextFunction,
    Request, Response
} from "express"
import {
    RequestContextService
} from "./request-context.service"

@Injectable()
export class ContextMiddleware implements NestMiddleware {
    constructor(private readonly requestContext: RequestContextService) {}

    use(req: Request, _res: Response, next: NextFunction) {
        const store = new Map<string, unknown>()

        // init for all requests
        this.requestContext.run(store, () => {
            next()
        })
    }
}
