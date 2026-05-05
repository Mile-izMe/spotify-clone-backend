import {
    RedisService 
} from "@modules/native"
import {
    Injectable, 
    InternalServerErrorException, 
    Logger
} from "@nestjs/common"
import * as argon2 from "argon2"
import {
    randomBytes
} from "crypto"

@Injectable()
export class HashService {
    private readonly logger = new Logger(HashService.name)
    constructor(
        private readonly redisService: RedisService,
    ) {}
    
    /**
     * Hash a password using argon2 algorithm.
     * @param password - The plain text password to hash.
     * @returns The hashed password.
     */
    async hashPassword(password: string): Promise<string> {
        try {
            return await argon2.hash(password,
                {
                    type: argon2.argon2id,
                })
        } catch (error) {
            this.logger.error(`Error hashing password: ${error.message}`)
            throw new InternalServerErrorException("Error processing security data")
        }
    }

    /**
     * Compare a plain text password with a hashed password.
     * @param password - The plain text password to compare.
     * @param hash - The hashed password to compare against.
     * @returns True if the password matches the hash, false otherwise.
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        try {
            return await argon2.verify(hash,
                password)
        } catch (error) {
            this.logger.error(`Error verifying password: ${error.message}`)
            return false
        }
    }

    /**
     * Generate a verification token for a user and store it in Redis with a TTL.
     * For Email Verification or Reset Password
     * @param userId - The ID of the user for whom to generate the token.
     * @param ttl - Time to live for the token in seconds (default is 600 seconds or 10 minutes).
     * @returns The generated verification token.
     */
    async generateVerificationToken(userId: string, ttl: number = 600): Promise<string> {
        const token = randomBytes(32).toString("hex")
        const key = `verify_token:${token}`

        try {
            // Save to Redis: Key = token, Value = userId
            // When verify we know token belong to which user
            await this.redisService.set(key,
                userId,
                ttl)
            return token
        } catch (error) {
            this.logger.error(`Error saving token to Redis: ${error.message}`)
            throw new InternalServerErrorException("Could not generate verification session")
        }
    }

    /**
     * Verify token from Redis
     * Return userId if valid, otherwise return null
     * Delete token from Redis after verification (one-time use)
     * @param token 
     * @returns 
     */
    async verifyAndConsumeToken(token: string): Promise<string | null> {
        const key = `verify_token:${token}`
        try {
            const userId = await this.redisService.get(key)
            if (userId) {
                // One-time use
                await this.redisService.del(key)
                return userId
            }
            return null
        } catch (error) {
            this.logger.error(`Error retrieving token from Redis: ${error.message}`)
            return null
        }
    }
}