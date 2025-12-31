import mongoose from "mongoose";
import { envData } from "./env.config.js";

// Connects to mongodb with infinite retry upon any error
export const initDb = async () => {
    let retries = 0;
    let delayMs = 3000; // 3000 milliseconds

    while (retries < Infinity) {
        try {
            await mongoose.connect(envData.MONGO_CONNECTION_STRING);
            console.log("***** Successfully connected to mongoDb *****");

            return;
        } catch (err) {
            retries++
            console.log(`***** Mongo connection error *****\n${err}`);
    
            if (retries < Infinity) {
                console.log(`Retrying in ${delayMs / 1000}s`);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            } else {
                console.error('All retry attempts failed, Shutting down server...');
                return process.exit(1);
            }
        }
    }
}