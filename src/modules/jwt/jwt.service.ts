import {
    HashService
} from "@modules/hash/hash.service"
import {
    RedisService
} from "@modules/native"
import {
    ForbiddenException,
    Injectable,
    Logger,
    UnauthorizedException
} from "@nestjs/common"
import {
    JwtService
} from "@nestjs/jwt"
import {
    JwtPayload 
} from "./types/jwt"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly usersService: UsersService,
        private readonly redisService: RedisService,
    ) {}
    private readonly logger = new Logger(AuthService.name)

    async login(email: string, pass: string, deviceId: string) {
        const user = await this.usersService.findByEmail(email)
    
        // 1. Check password
        const isMatch = await this.hashService.comparePassword(pass,
            user.password)
        if (!isMatch) throw new UnauthorizedException("Invalid credentials")

        // 2. Create Token Pair
        return this.generateTokenPair(user.id,
            user.roles,
            user.permissions,
            deviceId)
    }

    /**
    * GENERATE TOKEN PAIR (Hỗ trợ Rotation)
    */
    private async generateTokenPair(
        userId: string, 
        roles: string[], 
        permissions: string[], 
        deviceId: string
    ) {
        const payload: JwtPayload = {
            sub: userId, roles, permissions, deviceId 
        }

        // Access Token: Short lived (Vd: 15m) to lower risk when token being leaked
        // Refresh Token: Long lived (Vd: 7d)
        const [at,
            rt] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                    expiresIn: "15m", secret: process.env.JWT_AT_SECRET 
                }),
            this.jwtService.signAsync(payload,
                {
                    expiresIn: "7d", secret: process.env.JWT_RT_SECRET 
                }),
        ])

        // STORE & ROTATION IN REDIS
        // Each device has 1 Refresh Token at 1 time
        const redisKey = `rt:${userId}:${deviceId}`
        await this.redisService.set(redisKey,
            rt,
            7 * 24 * 60 * 60) 

        return {
            accessToken: at, refreshToken: rt 
        }
    }

    /**
    * REFRESH TOKEN FLOW: Detection
    */
    async refreshTokens(oldRt: string, deviceId: string) {
        try {
            // 1. Decode token not verify time to get in4 first
            const decoded = this.jwtService.decode(oldRt) as JwtPayload
            if (!decoded) throw new UnauthorizedException()

            const redisKey = `rt:${decoded.sub}:${deviceId}`
            const currentRtInRedis = await this.redisService.get(redisKey)

            // REUSE DETECTION
            // If token send not match with the "latest" token in Redis
            // Meaning the old RT has been used before -> There's an attempt to reuse a leaked RT
            if (currentRtInRedis !== oldRt) {
                await this.redisService.del(redisKey) // Immediately revoke
                this.logger.warn(`Potential Refresh Token Reuse Attack detected for User: ${decoded.sub}`)
                throw new ForbiddenException("Access Denied - Potential Security Breach")
            }

            // 2. Verify token (expiration, signature)
            await this.jwtService.verifyAsync(oldRt,
                {
                    secret: process.env.JWT_RT_SECRET 
                })

            // 3. Get latest user information (to prevent role/permission changes not reflected)
            const user = await this.usersService.findById(decoded.sub)
      
            // 4. Generate new token pair (rotate)
            return this.generateTokenPair(user.id,
                user.roles,
                user.permissions,
                deviceId)
      
        } catch (e) {
            this.logger.error(`Refresh failed: ${e.message}`)
            throw new UnauthorizedException("Session expired or invalid")
        }
    }

    /**
    * LOGOUT
     */
    async logout(userId: string, deviceId: string) {
        await this.redisService.del(`rt:${userId}:${deviceId}`)
    }
}