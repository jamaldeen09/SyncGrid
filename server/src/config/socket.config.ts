import { Server, Socket } from "socket.io"
import { SocketResponse } from "../types/socket.types.js";
import { redisClient } from "./redis.config.js";
import { LiveGameSchema } from "../types/game.types.js";


class SocketService {
    private _socket: Socket;
    private _io: Server;

    constructor(socket: Socket, io: Server) {
        this._socket = socket;
        this._io = io
    };

    // Used to emit socket events
    newEmitter<T = unknown>(event: string, data: T) {
        return this._socket.emit(event, data);
    };

    // Used to listen for events
    newListener<T = unknown>(event: string, callback: (args: T, callback: SocketResponse) => void) {
        return this._socket.on(event, callback);
    };

    // ===== Find game ===== \\
    async findGame(
        args: { userId: string, playAsPreference: "X" | "O" | "any" },
        callback: SocketResponse
    ) {
        try {
            const {
                userId,
                playAsPreference
            } = args;

            // Convert match making queue to an array to use .length()
            const rawMatchMakingQueue = await redisClient.zRange("matchmaking:queue", 0, -1);

            // If no game exists in the first place (prevents infinite check)
            if (rawMatchMakingQueue.length <= 0)
                return callback({
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
                const waitingPlayer = createdGame.players[0];

                // Check if the queue is already full
                if (createdGame.players.length >= 2) continue; // Move to the next iteration

                // Check if the user is already in the queue
                const isUserInQueue = waitingPlayer.user_id === userId;
                if (isUserInQueue) continue; // move to the next iteration

                // Check for available matches based on the requesting user's playAsPreference
                if (waitingPlayer.playing_as === "X" && playAsPreference === "X") continue; // move to the next iteration
                if (waitingPlayer.playing_as === "O" && playAsPreference === "O") continue; // "move to the next iteration"

                if (
                    (waitingPlayer.playing_as === "X" && playAsPreference === "O") ||
                    (waitingPlayer.playing_as === "O" && playAsPreference === "X") || (playAsPreference === "any")) {

                    foundGame = createdGame;
                    break; // Break the loop process
                }
            };

            // ===== Check if a game was found ===== \\
            if (!foundGame)
                return callback({
                    success: false,
                    message: "Failed to find a match",
                });

            // ===== Remove the found game from the matchmaking queue (indicating a match has been found) ===== \\
            const foundGameKey = `live-game:${foundGame._id}`
            await redisClient.zRem("matchmaking:queue", foundGameKey);

            return callback({
                success: true,
                message: "Successfully found a match",
                data: { gameId: foundGame._id }
            })
        } catch (err) {
            console.error(`***** Matchmaking error ******\nFile: socket.services.ts\n${err}`);
            callback({
                success: false,
                message: "A server error occured while trying to find a match, please try again shortly",
                error: {
                    code: "SERVER_ERROR",
                    statusCode: 500,
                }
            });
        }
    }

    // ===== Cancel search ===== \\
    // ! Potential http request update rather than event handler
    async cancelSearch(args: { gameId: string }, callback: SocketResponse) {
        try {
            // Remove the user's created game from the matchmaking queue
            await redisClient.zRem("matchmaking:queue", `live-game:${args.gameId}`);
            const rawGame = await redisClient.get(`live-game:${args.gameId}`);

            // Update the game and set it again in redis
            if (rawGame) {
                let game: LiveGameSchema = JSON.parse(rawGame);
                game = { ...game, status: "created" }

                await redisClient.set(`live-game:${game._id}`, JSON.stringify(game));
            }

            callback({
                success: true,
                message: "Search has been canceled",
            });  
        } catch (err) {
            console.error(`***** Opponent search error ******\nFile: socket.services.ts\n${err}`);
            callback({
                success: false,
                message: "A server error occured while trying to fufill your request to cancel the search for an opponent, please try again shortly",
                error: {
                    code: "SERVER_ERROR",
                    statusCode: 500,
                } 
            });
        }
    }

    // ===== Join game roon ===== \\
    async joinGameRoom(args: { gameId: string, matchmaking: boolean }) {
        this._socket.join(args.gameId);
        if (args.matchmaking) this._io.to(args.gameId).emit("found_game", { gameId: args.gameId })
    }
}

/**
 * Initializes socket.io and makes it possible to listen for events
 * @param io 
 */
export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        const service = new SocketService(socket, io);

        // ====== Matchmaking ====== \\
        service.newListener("find_game", (args: { userId: string, playAsPreference: "X" | "O" | "any" }, callback) =>
            service.findGame(args, callback)
        );

        service.newListener("cancel_search", (args: { gameId: string }, callback) =>
            service.cancelSearch(args, callback)
        );

        service.newListener("join_game_room", (args: { gameId: string, matchmaking: boolean }) => service.joinGameRoom(args))
    });
};

