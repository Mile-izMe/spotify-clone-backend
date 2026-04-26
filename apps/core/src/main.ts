
// we need to initialize sentry before anything else
// import "@modules/sentry/instrument"
import {
    setupCors
} from "@modules/cors"
import {
    envConfig
} from "@modules/env"
import {
    NestFactory
} from "@nestjs/core"
import compression from "compression"
import {
    AppModule
} from "./app.module"
// import {
//     setupCookie
// } from "@modules/cookie"
import {
    setupSwagger,
    SwaggerAuthenticationType
} from "@modules/docs"
// import {
//     RedisIoAdapter 
// } from "@modules/socketio"
// import {
//     createRedisKey, 
//     RedisClient,
//     RedisInstanceKey
// } from "@modules/native"
import {
    ContextLoggerService
} from "@modules/logger"

const bootstrap = async () => {
    const app = await NestFactory.create(
        AppModule,
        {
            logger: new ContextLoggerService(),
        }
    )
    // set the app to the globalThis object
    globalThis.__APP__ = app
    setupCors(app)
    // setupCookie(app)
    setupSwagger({
        app,
        title: "Spotify Clone API",
        description: "Spotify Clone API provides secure and structured access to the core backend services.",
        version: "1.0.0",
        basePath: "/api",
        useScalarDocs: true,
        swaggerEndpoint: "/swagger",
        scalarDocsEndpoint: "/scalar",
        enableAuthentication: true,
        authenticationType: SwaggerAuthenticationType.Bearer,
        authenticationName: "Authorization",
        enableVersioning: true,
    })
    app.use(compression())
    // const redis = app.get<RedisClient>(
    //     createRedisKey(RedisInstanceKey.Adapter), 
    //     {
    //         strict: false 
    //     }
    // )
    // const redisIoAdapter = new RedisIoAdapter(app)
    // redisIoAdapter.setClient(redis)
    // await redisIoAdapter.connect()
    // app.useWebSocketAdapter(redisIoAdapter)
    await app.listen(envConfig().services.core.port)
}
bootstrap()
