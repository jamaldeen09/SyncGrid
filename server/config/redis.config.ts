import { createClient, RedisClientType } from "redis";

// Redis client
export const redisClient: RedisClientType = createClient({
    url: 'redis://localhost:6379'
});


export type RedisOperationType = Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
}>;

export class RedisService {
    // Handles redis operation errors
    handleOperationErr (err: unknown, operation: "read" | "write" | "delete" | "update") {
        console.error(
            `***** Redis ${operation} operation error *****\nError:${err}\nFile: redis.config.ts`
        );

        return {
            success: false,
            error: err,
        }
    }

    // Read operation
    async readOperation(cacheKey: string): RedisOperationType {
        try {
            const rawData = await redisClient.get(cacheKey);
            return {
                success: true,
                data: rawData,
            }
        } catch (err) {
            return this.handleOperationErr(err, "read")
        }
    }

    // Write operation
    async writeOperation<T = unknown>(
        cacheKey: string,
        data: T,
        args?: { ttl: number; },
    ): RedisOperationType {
        try {
            // Store in redis conditionally (based on if ttl is provided)
            if (args && args.ttl) {
                await redisClient.setEx(cacheKey, args.ttl, JSON.stringify(data));
            } else {
                await redisClient.set(cacheKey, JSON.stringify(data));
            };

            return { success: true };
        } catch (err) {
            return this.handleOperationErr(err, "write")
        }
    }

    async deleteOperation (cacheKey: string) {
        try {
            await redisClient.del(cacheKey);
            return { success: true }
        } catch (err) {
            return this.handleOperationErr(err, "delete")
        }
    }
}

export const initRedis = async () => {
    let retries = 0;
    let delayMs = 3000;

    try {
        await redisClient.connect();
        console.log("***** Successfully connected to redis *****");

        // ** Handle connection errors globally, not inside the retry loop ** \\
        redisClient.on("error", (err) => {
            console.error(`***** Redis client error *****\nError: ${err}`);
        });

    } catch (err) {
        retries++
        console.log(`***** Redis connection error *****\nError: ${err}`);
        if (retries < Infinity) {
            console.log(`Retrying in ${delayMs / 1000}s`);
            new Promise((resolve) => setTimeout(resolve, delayMs))
        } else {
            console.error('All retry attempts failed, Shutting down server...');
            return process.exit(1);
        }
    }
}