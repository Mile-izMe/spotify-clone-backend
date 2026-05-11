import {
    PrismaService
} from "@modules/databases"
import {
    envConfig
} from "@modules/env"
import {
    RedisService
} from "@modules/native"
import {
    createNamespacedRedisKey,
    RedisKeyPrefix,
} from "@modules/native/redis"
import {
    Injectable
} from "@nestjs/common"
import {
    JwtService
} from "@nestjs/jwt"
import {
    createHash
} from "node:crypto"
import {
    JwtPayload
} from "./types/jwt"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService
    ) {}

    /**
    * GENERATE TOKEN PAIR (Rotation support)
    */
    async generateTokenPair(
        userId: string,
        username: string,
        roles: string[],
        permissions: string[],
        deviceId: string
    ) {
        const payload: JwtPayload = {
            sub: userId, username, roles, permissions, deviceId 
        }

        // Access Token: Short lived (Ex: 15m) to lower risk when token being leaked
        // Refresh Token: Long lived (Ex: 7d)
        const [at,
            rt] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                    expiresIn: envConfig().auth.jwt.atExpiration,
                    secret: envConfig().auth.jwt.atSecret 
                }),
            this.jwtService.signAsync(payload,
                {
                    expiresIn: envConfig().auth.jwt.rtExpiration,
                    secret: envConfig().auth.jwt.rtSecret 
                }),
        ])

        return {
            accessToken: at, refreshToken: rt 
        }
    }

    /**
    * LOGOUT
    */
    async logout(userId: string, deviceId: string) {
        const redisKey = createNamespacedRedisKey(
            RedisKeyPrefix.RefreshToken,
            userId,
            deviceId,
        )

        await Promise.all([
            // Delete in Redis
            this.redisService.del(redisKey),

            // Mark as revoked in DB for audit/history
            this.prisma.refreshToken.updateMany({
                where: {
                    userId,
                    deviceId,
                    isRevoked: false
                },
                data: {
                    isRevoked: true
                }
            })
        ])
    }

    async logoutAllDevices(userId: string) {
        const activeTokens = await this.prisma.refreshToken.findMany({
            where: {
                userId,
                isRevoked: false
            },
            select: {
                deviceId: true 
            }
        })

        if (activeTokens.length > 0) {
            const redisDeletePromises = activeTokens.flatMap(t => {
                if (!t.deviceId) {
                    return []
                }

                return this.redisService.del(createNamespacedRedisKey(
                    RedisKeyPrefix.RefreshToken,
                    userId,
                    t.deviceId,
                ))
            })
            await Promise.all(redisDeletePromises)
        }

        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                isRevoked: false
            },
            data: {
                isRevoked: true,
            }
        })
    }

    /**
     * Helper function to update refresh token data in both Redis and Database during token rotation
     * @param userId 
     * @param deviceId 
     * @param refreshToken 
     */
    async updateRefreshTokenData(userId: string, deviceId: string, refreshToken: string) {
        const redisKey = createNamespacedRedisKey(
            RedisKeyPrefix.RefreshToken,
            userId,
            deviceId,
        )
        const ttl = envConfig().auth.jwt.rtExpiration 
        const hashedToken = this.hashToken(refreshToken)

        await Promise.all([
            // Update Redis with new RT and reset TTL (Check Reuse Detection)
            this.redisService.set(redisKey, refreshToken, ttl),

            // Update DB record for audit/history (Optional, can be used for monitoring or manual revocation)
            this.prisma.refreshToken.updateMany({
                where: {
                    userId: userId,
                    deviceId: deviceId,
                    isRevoked: false
                },
                data: {
                    isRevoked: true 
                }
            }),

            this.prisma.refreshToken.create({
                data: {
                    userId,
                    deviceId,
                    tokenHash: hashedToken,
                    expiryTime: ttl,
                    isRevoked: false
                }
            }),
        ])
    }

    private hashToken(token: string): string {
        return createHash("sha256").update(token).digest("hex")
    }
}