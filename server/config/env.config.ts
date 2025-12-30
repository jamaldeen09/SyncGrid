import dotenv from "dotenv"

// Reads .env file
dotenv.config();


interface EnvData {
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    MONGO_CONNECTION_STRING: string;
    PORT: string;
    HOST_URL: string;
    FRONTEND_URL: string;
    LOCAL_HOST_URL: string;
} 

// Contains data in .env file
export const envData: EnvData = {
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING!,
    PORT: process.env.PORT!,
    HOST_URL: process.env.HOST_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    LOCAL_HOST_URL: process.env.LOCAL_HOST_URL!,
}

