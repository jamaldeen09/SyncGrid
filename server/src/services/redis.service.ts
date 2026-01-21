import { redisClient } from "../config/redis.config.js";


export class RedisService {
    // ===== Gets a cached value from redis ===== \\
    async readOperation(key: string) {
        return await redisClient.get(key)
    }

    // ===== Adds a value ===== \\
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

    // ===== Deletes a value ===== \\
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

    /**
     * It manages an element in a matchmaking queue
     * @param key 
     * @param operation 
     * @param element 
     */
    async matchmakingQueueOperation<TElement>(
        key: string,
        operation: "grab-last" | "add" | "remove" | "get-length",
        element?: TElement,
    ) {
        switch (operation) {
            case "add":
                return await redisClient.lPush(key, JSON.stringify(element));

            case "grab-last":
                return await redisClient.rPop(key);

            case "remove":
                return await redisClient.lRem(key, 0, JSON.stringify(element))

            case "get-length":
                return await redisClient.lLen(key)
        };
    }
}