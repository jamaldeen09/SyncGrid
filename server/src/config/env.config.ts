import dotenv from "dotenv"

// Reads .env file
dotenv.config();

interface EnvData {
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    MONGO_CONNECTION_STRING: string;
    PORT: number;
    HOST_URL: string;
    FRONTEND_URL: string;
    LOCAL_HOST_URL: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    CLOUDINARY_NAME: string;
    CLOUDINARY_KEY: string;
    CLOUDINARY_SECRET: string;
}

// Contains data in .env file
export const envData: EnvData = {
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING!,
    PORT: parseInt(process.env.PORT! || ""),
    HOST_URL: process.env.HOST_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    LOCAL_HOST_URL: process.env.LOCAL_HOST_URL!,
    REDIS_USERNAME: process.env.REDIS_USERNAME!,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: parseInt(process.env.REDIS_PORT! || ""),
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME!,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET!,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY!,
}

