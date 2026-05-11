export const REDIS = "Redis"
export const createRedisKey = (key?: string) =>
    key ? `${REDIS}:${key}` : REDIS

import {
    RedisKeyPrefix,
} from "../enums"

export const createNamespacedRedisKey = (
    prefix: RedisKeyPrefix,
    ...parts: Array<string | number>
): string => [prefix,
    ...parts].join(":")
