import { redisClient } from "../config/redis.config.js";


export class RedisService {
    // ===== Gets a cached value from redis ===== \\
    async readOperation(key: string) {
        return await redisClient.get(key)
    }

    // ===== Caches a value in redis ===== \\
    async writeOperation<T>(
        key: string,
        value: T,
        ttl?: number
    ) {
        if (ttl) {
            await redisClient.setEx(
                key,
                ttl,
                JSON.stringify(value)
            )
        } else {
            await redisClient.set(
                key,
                JSON.stringify(value)
            )
        }
    };

    // ===== Deletes a cached value from redis ===== \\
    async deleteOperation(
        key?: string,
        pattern?: string,
    ) {
        if (key && pattern) throw new Error(`Redis service error\nOperation: DELETE\nFile: redis.service.ts\nError: A key OR a pattern must be provided not both`);

        if (key) {
            await redisClient.del(
                key
            );
        }

        if (pattern) {
            const keys = await redisClient.keys(pattern);
            keys.forEach(async (key) => await redisClient.del(key));
        }
    }
}