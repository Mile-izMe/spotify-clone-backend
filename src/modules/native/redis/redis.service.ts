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
}