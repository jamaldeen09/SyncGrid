import { redisClient, RedisService } from './../config/redis.config.js';
import mongoose from "mongoose";
import { LiveGameSchema, matchmakingQueue } from "../lib/storage.js";
import { SocketResponse } from "../types/socket.types.js";


const createMatch = () => {
    return {
        _id: new mongoose.Types.ObjectId(),
        players: [
            {
                user_id: "jamal_id",
                time_left_ms: 120000,
                time_left_till_deemed_unsuitable_for_match_ms: 20000,
                playing_as: "X",
            }
        ],

        moves: [],
        current_turn: "X",
        is_game_started: false,
    }
};



export const findMatch = async (
    args: { userId: string, playAsPreference: "X" | "O" | "any" },
    respond: SocketResponse
) => {
    try {
        const {
            userId,
            playAsPreference
        } = args;

        // const { readOperation, writeOperation } = new RedisService()

        // const gameKey = `game:${createMatch()._id}`
        // await writeOperation(gameKey, createMatch());
        // await redisClient.zAdd("matchmaking:queue", { score: Date.now(), value: gameKey });

        // Convert match making queue to an array to use .length()
        const rawMatchMakingQueue = await redisClient.zRange("matchmaking:queue", 0, -1);

        // If no game exists in the first place (prevents infinite check)
        if (rawMatchMakingQueue.length <= 0)
            return respond({
                success: false,
                message: "No games have been created yet"
            });

        let foundGame: LiveGameSchema | null = null;

        // ===== Search for a game ===== \\
        for (const rawGameKey of rawMatchMakingQueue) {
            const rawGameData = await redisClient.get(rawGameKey);

            // ===== Delete match if it wasnt stored in the first place ===== \\
            if (!rawGameData) {
                await redisClient.zRem("matchmaking:queue", rawGameKey);
                continue; // next iteration
            }

            const createdGame: LiveGameSchema = JSON.parse(rawGameData);
            console.log("CREATED GAME: ", createdGame.players);
            const waitingPlayer = createdGame.players[0];

            // Check if the queue is already full
            if (createdGame.players.length >= 2) continue; // Move to the next iteration

            // Check if the user is already in the queue
            const isUserInQueue = waitingPlayer.user_id === userId;
            if (isUserInQueue) continue; // move to the next iteration

            // Check for available matches based on the requesting user's playAsPreference

            console.log("PLAYING AS: ", waitingPlayer.playing_as, "PLAYER PREFERENCE: ", playAsPreference);
            if (waitingPlayer.playing_as === "X" && playAsPreference === "X") continue; // move to the next iteration
            if (waitingPlayer.playing_as === "O" && playAsPreference === "O") continue; // "move to the next iteration"


            if (
                (waitingPlayer.playing_as === "X" && playAsPreference === "O") ||
                (waitingPlayer.playing_as === "O" && playAsPreference === "X") || (playAsPreference === "any")) {
                    console.log("CONDITION HAS BEEN PASSED!!!!")
                foundGame = createdGame;
                break; // Break the loop process
            }
        };

        // ===== Check if a game was found ===== \\
        if (!foundGame)
            return respond({
                success: false,
                message: "Failed to find a match",
            });


        // ===== Remove the found game from the matchmaking queue and from storage completely ===== \\
        const foundGameKey = `game:${foundGame._id}`
        await redisClient.zRem("matchmaking:queue", foundGameKey);
        await redisClient.del(foundGameKey);

        return respond({
            success: true,
            message: "Successfully found a match",
            data: { game_id: foundGame._id }
        });
    } catch (err) {
        console.error(`***** New Error ******\nFile: socket.services.ts\n${err}`);
        respond({
            success: false,
            message: "A server error occured while trying to find a match, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        });
    }
}     