import { createClient, RedisClientType } from "redis";
import { envData } from "./env.config.js";
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

// Redis client
export const redisClient: RedisClientType = createClient({
    // url: 'redis://localhost:6379'
    username: envData.REDIS_USERNAME,
    password: envData.REDIS_PASSWORD,
    socket: {
        host: envData.REDIS_HOST,
        port: envData.REDIS_PORT,
    }
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

export const createApiLimiter = (
    windowMs?: number, 
    limit?: number,
) => {
    return rateLimit({
        // ---------------------------------------------
        // 1. The Fixed Limit Cap and Window Duration
        // ---------------------------------------------
        windowMs: windowMs || 15 * 60 * 1000, // 15 minutes (in milliseconds)
        limit: limit || 100, // Max 100 requests per 15 minutes
        
        // ---------------------------------------------
        // 2. The Sliding Window Engine (Redis)
        // ---------------------------------------------
        store: new RedisStore({ 
            // Passes the command execution logic to your connected Redis client
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
    
        // ---------------------------------------------
        // 3. Client Communication
        // ---------------------------------------------
        standardHeaders: true, // Adds RateLimit-Remaining, RateLimit-Limit headers
        legacyHeaders: false, // Turns off deprecated headers
    
        // Response body for blocked requests (HTTP 429 status is automatic)
        message: {
            error: "Too Many Requests",
            message: "You have exceeded the limit of 100 requests per 15 minutes.",
        }
    });
}