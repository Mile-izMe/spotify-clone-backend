import {
    INestApplication 
} from "@nestjs/common"
import {
    envConfig 
} from "@modules/env"
import {
    CorsOptions 
} from "@nestjs/common/interfaces/external/cors-options.interface"

/**
 * Create cors options
 */
export const createCorsOptions = (): CorsOptions => ({
    origin: (origin, callback) => {
        // Allow no-origin (mobile apps/curl) or specific dev origins
        if (!origin || origin.includes("video-dev.org") || origin.includes("localhost")) {
            callback(null,
                true)
        } else {
            // Check against your env config for production
            const allowedOrigins = envConfig().cors.origins
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null,
                    true)
            } else {
                callback(new Error("Not allowed by CORS"))
            }
        }
    },
    credentials: true,
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    // HLS players often need the 'Range' header for partial content fetching
    allowedHeaders: ["Content-Type",
        "Authorization",
        "Range"],
    // Crucial for HLS: let the FE see the content length
    exposedHeaders: ["Content-Length",
        "Content-Range"],
})

/**
 * Setup cors for NestJS application
 */
export const setupCors = (app: INestApplication) => {
    app.enableCors(createCorsOptions())
}

