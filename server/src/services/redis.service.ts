import { LiveGame } from "@shared/index.js";
import { redisClient } from "../config/redis.config.js";


export class RedisService {
    /**
     * Reads a value from redis
     * @param key 
     */
    async readOperation(key: string) {
        return await redisClient.get(key);
    }

    /**
     * Adds a value to redis
     * @param key 
     * @param value 
     * @param ttl 
     */
    async writeOperation<T>(key: string, value: T, ttl?: number) {
        const finalValue = typeof value === "string" ? value : JSON.stringify(value);
        if (ttl) await redisClient.setEx(key, ttl, finalValue);
        else await redisClient.set(key, finalValue);
    };

    /**
     * Deletes a value from redis
     * @param key 
     * @param pattern 
     */
    async deleteOperation(key?: string, pattern?: string,
    ) {
        if (key && pattern)
            throw new Error(`Redis service error\nOperation: DELETE\nFile: redis.service.ts\nError: A key OR a pattern must be provided not both`);

        if (key) await redisClient.del(key);

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
    async matchmakingQueueOperation(
        key: string,
        operation: "grab-last" | "add" | "remove" | "get-length",
        userId?: string,
    ) {
        switch (operation) {
            case "add":
                return await redisClient.lPush(key, userId!);

            case "grab-last":
                return await redisClient.rPop(key);

            case "remove":
                return await redisClient.lRem(key, 0, userId!);

            case "get-length":
                return await redisClient.lLen(key);
        };
    };

    async getAllLiveGames(): Promise<LiveGame[]> {
        const liveGameKeys = await redisClient.keys(`live-game:*`)
        const liveGames: LiveGame[] = [];

        // Prevent looping if there aren't any live games
        // to being with
        if (liveGameKeys.length <= 0) return liveGames;

        // Loop through each live game
        for (const key of liveGameKeys) {
            const game = await this.readOperation(key);
            if (!game) continue // skip itr

            liveGames.push(JSON.parse(game) as LiveGame);
        }

        return liveGames
    }
}

export const redisService = new RedisService();