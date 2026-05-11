import {
    ExtractJwt, Strategy 
} from "passport-jwt"
import {
    PassportStrategy 
} from "@nestjs/passport"
import {
    Injectable, UnauthorizedException 
} from "@nestjs/common"
import {
    RedisService 
} from "@modules/native"
import {
    envConfig 
} from "@modules/env"
import {
    JwtPayload 
} from "@features/api/graphql/auth/types"
import {
    RequestContextService 
} from "@modules/context/request-context.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly redisService: RedisService, 
        private readonly requestContext: RequestContextService
    ) {
        super({
            // Extract token from header Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Not ignore expiration, Passport will handle it
            secretOrKey: envConfig().auth.jwt.atSecret,
        })
    }
    
    /**
    * validate func called when Passport verify signature and expiration successfully.
    * Response will be assigned to `req.user`.
    */
    async validate(payload: JwtPayload) {
        // ADVANCED: Check acessToken in BlackList (user Logout)
        // This key set in logout func with TTL as the time left of AT
        const isBlacklisted = await this.redisService.get(`bl_${payload.sub}`)
        if (isBlacklisted) {
            throw new UnauthorizedException("Token has been deactivated (Blacklisted)")
        }

        const user = {
            id: payload.sub,
            username: payload.username
        }

        this.requestContext.setUser(user)

        // Return the user object for subsequent guards to use
        // req.user will have the structure of JwtPayload
        return { 
            userId: payload.sub, 
            roles: payload.roles, 
            permissions: payload.permissions,
            deviceId: payload.deviceId 
        }
    }
}