import {
    Injectable,
} from "@nestjs/common"
import {
    InjectRedis,
} from "./redis.decorators"
import {
    RedisInstanceKey,
} from "./enums"
import type {
    RedisClient,
} from "./types"

@Injectable()
export class RedisService {
    constructor(
        @InjectRedis(RedisInstanceKey.Cache)
        private readonly redisClient: RedisClient,
    ) {}

    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key)
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ): Promise<void> {
        await this.redisClient.set(key,
            value)

        if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
            await this.redisClient.expire(key,
                ttlSeconds)
        }
    }

    async del(key: string): Promise<number> {
        return this.redisClient.del(key)
    }

    async setBuffer(
        key: string,
        value: Buffer,
        ttlSeconds?: number,
    ): Promise<void> {
        if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
            await this.redisClient.set(key, value, {
                EX: ttlSeconds
            })
        } else {
            await this.redisClient.set(key, value)
        }
    }

    async getBuffer(key: string): Promise<Buffer | null> {
        // Sử dụng cách gọi trực tiếp này để ép kiểu trả về là Buffer
        const result = await this.redisClient.get(
            key
        )

        // Nếu kết quả là string, ta convert nó về Buffer
        // Nhưng để tối ưu nhất, hãy đảm bảo Client được tạo với tính năng trả về Buffer
        if (typeof result === "string") {
            return Buffer.from(result, "binary")
        }

        return result as Buffer | null
    }
}