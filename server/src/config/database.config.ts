import mongoose from "mongoose";
import { envData } from "./env.config.js";
import { Game } from "../models/Game.js";
import { redisClient } from "./redis.config.js";
import { User } from "../models/User.js";


const deleteAllGames = async () => {
    await Game.deleteMany();
    const keys = await redisClient.keys("game:");

    keys.forEach(async (key) => await redisClient.del(key));
}

const deleteAllUsers = async () => {
    await User.deleteMany();
}

// Connects to mongodb with infinite retry upon any error
export const initDb = async () => {
    let retries = 0;
    let delayMs = 3000;

    while (retries < Infinity) {
        try {
            await mongoose.connect(envData.MONGO_CONNECTION_STRING);
            console.log("***** Successfully connected to mongoDb *****");

            // await deleteAllGames(); 
            // await Game.updateMany({}, { $set: { "game_settings.status": "created" } });

            // await Game.findByIdAndUpdate("695e763827b356db00abb61a", {
            //     $set: {
            //         moves: [
            //             {
            //               played_at: new Date(),
            //               played_by: "6956af858a2053db5c1b664d",
            //               value: "X",
            //               location: 0
            //             }
            //         ],
            //     }
            // })
            // await User.findOneAndUpdate({ username: "i-am-here" }, { $set: { password_hash: await bcrypt.hash("i-am-here-password", 12) } });
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