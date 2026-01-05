import { createClient, RedisClientType } from "redis";

// Redis client
export const redisClient: RedisClientType = createClient({
    url: 'redis://localhost:6379'
});

export const initRedis = async () => {
    let retries = 0;
    let delayMs = 3000;

    try {
        await redisClient.connect();
        console.log("***** Successfully connected to redis *****");

        // ** Handle connection errors globally, not inside the retry loop ** \\
        redisClient.on("error", (err) => {
            console.error(`***** Redis client error *****\n${err}`);
        });

    } catch (err) {
        retries++
        console.log(`***** Redis connection error *****\n${err}`);
        if (retries < Infinity) {
            console.log(`Retrying in ${delayMs / 1000}s`);
            new Promise((resolve) => setTimeout(resolve, delayMs))
        } else {
            console.error('All retry attempts failed, Shutting down server...');
            return process.exit(1);
        }
    }
}