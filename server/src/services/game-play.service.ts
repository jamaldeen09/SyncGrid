import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service.js";
import { redisService } from "./redis.service.js";
import { ListenerCallback, LiveGame, LiveGameForBanner, NewMoveArgs } from "@shared/index";
import { ConfiguredSocket } from "../types/socket.types.js";
import { gameService } from "./game.service.js";
import { events } from "../lib/events.js";
import { GameBeingTerminated } from "../types/game.types.js";
import mongoose from "mongoose";
import { userService } from "./user.service.js";

// ===== Terminate game ===== \\
async function terminateGame(
    liveGame: LiveGame,
    status: LiveGame["status"],
    result: LiveGame["result"],
    winner: string | null,
    io: Server,
) {
    let CURRENT_RETRY = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 500;

    while (CURRENT_RETRY < MAX_RETRIES) {
        try {

            // Game
            let game: GameBeingTerminated = null;

            // Payload being sent to client
            let payload: ({
                result: LiveGame["result"];
                status: LiveGame["status"];
                winner: string | null;
                message: string;
            }) = ({
                result,
                status,
                winner,
                message: ""
            });

            // Determine if the final status of the game is canceled (to prevent storing canceled games)
            if (status === "canceled") {
                // Delete the game from the database if no user played
                game = await gameService.deleteGame<GameBeingTerminated>({
                    returnDeletedDoc: true,
                    optionConfig: ({ optionType: "find", option: "via-id" }),
                    id: liveGame._id,
                }) as GameBeingTerminated;

                // Null check to prevent ts errors
                if (!game) return;
                const playerUserIds = game.players.map((player) => player.userId);

                // Prepare banner game keys for both users
                const firstKey = `user:${playerUserIds[0]}-banner-game:${game._id}`;
                const secondKey = `user:${playerUserIds[1]}-banner-game:${game._id}`;

                // Delete banner games from redis for both users
                await redisService.deleteOperation(undefined, firstKey);
                await redisService.deleteOperation(undefined, secondKey);

                // Delete the live game itself from redis as well
                await redisService.deleteOperation(`live-game:${game._id}`);

                // Delete the game key that was used to get players data from redis
                await redisService.deleteOperation(`game:${game._id}`);

                // Prepare and emit the payload to the frontend
                payload["message"] = "Game canceled due to inactivity"

                // Socket Emission
                io.to(`game-room:${game._id}`).emit(events.gameEnded, payload)

                // Stop the function from running further after making updates
                return;
            };


            // ** ===== UPDATE THE GAME IF THE STATUS ISN'T CANCELED ===== ** \\

            //  Database Update
            game = await gameService.updateGame<GameBeingTerminated>({
                updateQuery: {
                    "gameSettings.status": "finished",
                    result,
                    winner,
                    moves: liveGame.moves,
                    finishedAt: new Date(),
                },
                id: liveGame._id,
                optionConfig: ({
                    optionType: "find",
                    option: "via-id"
                }),
                selectFields: "players winner",
                returnUpdatedDoc: true,
            }) as GameBeingTerminated

            // Null check (to prevent ts errors)
            if (!game) return;

            // Update the winner's win streak and their best streak
            // Reset the current users win streak back to 0 as well
            if (game.winner) {
                // Update the winner
                const winner = await userService.updateUser<{
                    _id: mongoose.Types.ObjectId;
                    username: string;
                } | null>({
                    returnUpdatedDoc: true,
                    optionConfig: ({ optionType: "find", option: "via-id" }),
                    id: game.winner?.toString(),
                    updateQuery: [
                        {
                            $set: {
                                currentWinStreak: { $add: ["$currentWinStreak", 1] },
                                bestWinStreak: {
                                    $max: ["$bestWinStreak", { $add: ["$currentWinStreak", 1] }]
                                }
                            }
                        }
                    ],
                    selectFields: "username"
                }) as ({
                    _id: mongoose.Types.ObjectId;
                    username: string;
                }) | null

                if (!winner) return;

                // ** LOSER UPDATE (RESET THEIR CURRENT WIN STREAK TO 0)
                const loserId = game.players.find((player) => player.userId.toString() !== winner._id.toString());
                const updatedLoser = await userService.updateUser<{
                    _id: mongoose.Types.ObjectId;
                    username: string;
                } | null>({
                    returnUpdatedDoc: true,
                    optionConfig: ({ optionType: "find", option: "via-id" }),
                    id: loserId?.userId.toString(),
                    updateQuery: ({
                        $set: {
                            currentWinStreak: 0,
                        }
                    }),
                    selectFields: "username"
                }) as {
                    _id: mongoose.Types.ObjectId;
                    username: string;
                } | null;

                // Prevent ts errors
                if (!updatedLoser) return;

                // Delete their public profile cache to make their best win streak change reflect
                await redisService.deleteOperation(`profile-${winner.username.toLowerCase()}`);
                await redisService.deleteOperation(`profile-${updatedLoser.username.toLowerCase()}`);
            }


            const playersUserId = game.players.map((player) => player.userId);

            // ==== Redis Cleanup ==== 
            await redisService.deleteOperation(`live-game:${game._id}`);
            await redisService.deleteOperation(`game:${game._id}`);
            await redisService.deleteOperation(`user:${playersUserId[0]}-banner-game`);
            await redisService.deleteOperation(`user:${playersUserId[1]}-banner-game`);

            // Paginations keys (to make the new game reflect instantly)
            await redisService.deleteOperation(undefined, `user-${playersUserId[0]}-games*`);
            await redisService.deleteOperation(undefined, `user-${playersUserId[1]}-games*`);

            // Send payload to the frontend
            payload["message"] = "Game finished"

            // Socket Emission
            io.to(`game-room:${game._id}`).emit(events.gameEnded, payload);
            return;
        } catch (err) {
            CURRENT_RETRY++;
            console.error(`Attempt ${CURRENT_RETRY} failed for terminateGame: ${liveGame._id}`);
            console.error(`Error: ${err}`)

            if (CURRENT_RETRY >= MAX_RETRIES) {
                console.error("FATAL: Could not terminate game after 5 attempts. Manual cleanup required.");
                return;
            }

            // Wait before retrying (prevents CPU spiking)
            await new Promise(res => setTimeout(res, RETRY_DELAY * CURRENT_RETRY));
        }
    }
}

// ===== Game play service ===== \\
export class GamePlayService {
    private _io: Server;
    private _socket: Socket;

    constructor(io: Server, socket: Socket) {
        this._io = io
        this._socket = socket;
    }

    /**
    * Provides the requesting socket with the live data of a game
    * @param args 
    * @param callback 
    */
    async getLiveGame(
        args: { gameId: string, socketService: SocketService },
        callback: ListenerCallback<{ liveGame: LiveGame }>,
    ) {
        try {
            const key = `live-game:${args.gameId}`
            const rawLiveGame = await redisService.readOperation(key);


            // Check if game exists
            if (!rawLiveGame) {
                return callback({
                    success: false,
                    message: "Game was not found or has most likely ended",
                });
            }

            // Add the requesting socket to the game room anytime
            // they request a live game's data
            args.socketService.joinRoom(`game-room:${args.gameId}`);

            return callback({
                success: true,
                message: "Successfully fetched game's live data",
                data: ({
                    liveGame: JSON.parse(rawLiveGame),
                }),
            });
        } catch (err) {
            console.error(`Live game fetch error\nFile: socket.service.ts\nFunction: getLiveGame\n${err}`);
            return callback({
                success: false,
                message: "Failed to fetch live game data"
            })
        }
    }

    async getBannerLiveGame(args: ({
        gameId: string
    }), callback: ListenerCallback) {
        try {
            const rawLiveGame = await redisService.readOperation(`live-game:${args.gameId}`);

            if (!rawLiveGame) {
                return callback({
                    success: false,
                    message: "Game does not exist or you are currently not in any active games",
                })
            }
            const liveGame = JSON.parse(rawLiveGame) as LiveGame;
            const formattedGame: LiveGameForBanner = ({
                _id: liveGame._id,
                moves: liveGame.moves.map((move) => ({
                    boardLocation: move.boardLocation,
                    value: move.value,
                })),
                players: liveGame.players,
                currentTurn: liveGame.currentTurn,
            });

            return callback({
                success: true,
                message: "Banner live game has been fetched successfully",
                data: ({ bannerLiveGame: formattedGame })
            })
        } catch (err) {
            console.error(`Banner live game fetch error\nFile: socket.service.ts\nFunction: getBannerLiveGame\n${err}`);
            return callback({
                success: false,
                message: "Failed to fetch banner live game data"
            })
        }
    };

    /**
     * Makes a new move in a game
     * @param args 
     * @param callback 
     */
    async newMove(args: (NewMoveArgs & { socketService: SocketService }), callback: ListenerCallback) {
        try {
            const rawLiveGame = await redisService.readOperation(`live-game:${args.gameId}`);

            // Check if the game even exists in redis or not
            if (!rawLiveGame) {
                return callback({
                    success: false,
                    message: "Game not found or has already finished"
                });
            }

            // If the game does exist parse it because redis values are in strings/stringified objects
            // and also extract the unix timestamp of RIGHT NOW (needed for some calculations)
            const liveGame = JSON.parse(rawLiveGame) as LiveGame;
            const now = Date.now();

            // ** ANCHOR TIME: 
            // this is basically the time that is going to be substracted from RIGHT NOW and
            // the result of that substraction gives us a "duration" clarity.
            // Anchor time can either be WHEN the game was created or WHEN the last move
            // in the game was made. Why? not all games must have moves in them, so to battle that
            // after 20 seconds moves cannot be made again, so since lastMoveAt is null initially 
            // when the game gets created, createdAt handles it because we know as soon as now - createAt
            // hits 20 seconds the game is no longer available and has been "CANCELED"

            // ** ELAPSED
            // elapsed is basically just the duration between x time (when the game was created or when 
            // the last move was played) --> and --> now so after substraction now - (x time), the result
            // is a "duration" between ** (when the game was created/when the last move was played) **
            // and now
            const anchorTime = liveGame.lastMoveAt ? new Date(liveGame.lastMoveAt).getTime() : new Date(liveGame.createdAt).getTime();
            const elapsed = now - anchorTime;

            // ** INITIAL CHECK
            // This basically checks for if no moves have been made in the game
            // (if that is the case the anchor time will use WHEN the game was created)
            // then we follow it up by checking if the resulting duration is greater than
            // or equals to 20 seconds (that is the maximum amount of time a user can go
            // without making any moves) then if the condition is met the game gets "terminated"
            if (liveGame.moves.length === 0 && elapsed >= 25000) {
                await terminateGame(liveGame, "canceled", "decisive", null, this._io);
                return callback({ success: false, message: "Game expired: No move made in 20s" });
            }

            // ** CALCULATE REMAINING TIME FOR PLAYERS
            // This basically gets the same "duration" that was talked about
            // but instead we are getting the time left for each user in the game before they aren't allowed to make another move

            // ** ELAPSED
            // elapsed in this case is already a resulting "duration" which is derived from when the game
            // was created or when the last move was made. Each players time substracted by the resulting duration
            // helps us know how much time the player has left basically creating a "new time" which we want to update
            // any time a user makes a move
            const updatedPlayers = liveGame.players.map(player => {
                // Only deduct time from the person whose turn it IS
                if (player.preference === liveGame.currentTurn) {
                    const newTime = player.timeLeftMs - elapsed;
                    return ({
                        ...player,
                        timeLeftMs: Math.max(0, newTime)
                    });
                }
                return player;
            });

            // This is basically used to get the currently active player
            // aka. the player whos time is reduced
            const activePlayer = updatedPlayers.find(p => p.preference === liveGame.currentTurn);

            // This is basically to know if the active player's
            // time has ran out. This prevents the socket wishing to make a move
            // from actually registering the move even though the other player's time has ended 
            if (activePlayer && activePlayer.timeLeftMs <= 0) {
                const winner = updatedPlayers.find(p => p.userId !== activePlayer.userId);
                await terminateGame(liveGame, "finished", "decisive", (winner?.userId || null), this._io);
                return callback({
                    success: false,
                    message: "Your time has run out",
                    data: ({ status: "lost" })
                });
            }

            if (liveGame.moves.length === 9 || liveGame.result !== "pending" || liveGame.status !== "active") {
                return callback({
                    success: false,
                    message: "Game has already ended"
                })
            }

            // This just calculates who's turn it is
            // and prevents the requesting socket from making a move if it isn't currently
            // the socket's turn to play
            if (liveGame.currentTurn !== args.moveData.value) {
                return callback({ success: false, message: "It isn't your turn yet" });
            };

            // New move
            const newMove = ({
                playedAt: new Date(),
                playedBy: (this._socket as ConfiguredSocket).user.userId,
                boardLocation: args.moveData.boardLocation,
                value: args.moveData.value
            });

            // Updated game state with updated players, moves, and 
            // lastMoveAt() indicating when a last move was played
            const winner = liveGame.players.find((player) => player.userId === args.winner);
            let updatedGameState: LiveGame = ({
                ...liveGame,
                players: updatedPlayers,
                currentTurn: liveGame.currentTurn === "X" ? "O" : "X",
                moves: [
                    ...liveGame.moves,
                    newMove
                ],
                lastMoveAt: Date.now(),
                winner: winner ? winner.userId : null,
            });

            // Handle winning
            if (updatedGameState.winner) {
                return await terminateGame(
                    updatedGameState,
                    "finished", "decisive",
                    updatedGameState.winner, this._io
                )
            }

            // Handle draws
            if ((updatedGameState.moves.length === 9) && (!updatedGameState.winner)) {
                return await terminateGame(
                    updatedGameState,
                    "finished", "draw",
                    null, this._io
                );
            };

            // RESTORE the game in redis
            await redisService.writeOperation(`live-game:${updatedGameState._id}`, updatedGameState);


            // ** EMIT TO OPPONENT
            const payload = ({
                updatedMoves: updatedGameState.moves,
                currentTurn: updatedGameState.currentTurn,
                players: updatedGameState.players,
                winner: updatedGameState.winner,
                result: updatedGameState.result,
                serverTime: Date.now()
            });

            args.socketService.newEmitter(
                events.moveRegistered,
                payload, "io", "to-room-emission",
                `game-room:${updatedGameState._id}`
            );

            return callback({
                success: true,
                message: "Move registered",
                data: payload
            });
        } catch (err) {
            return callback({
                success: false,
                message: "An unexpected error occured during move registration",
            })
        }
    }

    /**
     * Listens for status updates for instantaneous changes in opponent's
     * screen
     * @param args 
     * @param socketService 
     */
    statusUpdateForOpponent(args: {
        status: "won" | "lost" | "draw" | "canceled";
        gameId: string;
    }, socketService: SocketService) {
        socketService.newEmitter(
            events.statusUpdate,
            { status: args.status },
            "socket", "to-room-emission",
            `game-room:${args.gameId}`
        )
    }
}


// ** ===== GAME JANITOR ===== ** \\
export const mountGameJanitor = (io: Server) => {
    setInterval(async () => {
        try {
            const liveGames = await redisService.getAllLiveGames();
            if (liveGames.length === 0) return;

            for (const game of liveGames) {
                try {
                    const now = Date.now();
                    // Use lastMoveAt, fallback to createdAt for the first turn
                    const anchorTime = game.lastMoveAt || new Date(game.createdAt).getTime();
                    const elapsedSinceLastMove = now - anchorTime;
                    const activePlayer = game.players.find((p) => p.preference === game.currentTurn);

                    if (game.moves.length === 0 && elapsedSinceLastMove >= 25000) {
                        await terminateGame(game, "finished", "decisive", null, io);
                        continue;
                    }


                    if (activePlayer && (activePlayer.timeLeftMs - elapsedSinceLastMove) <= 0) {
                        const winner = game.players.find((p) => p.userId !== activePlayer.userId);
                        await terminateGame(game, "finished", "decisive", winner?.userId || null, io);
                        continue;
                    }

                } catch (innerErr) {
                    console.error(`Janitor failed to process game ${game._id}:`, innerErr);
                }
            }
        } catch (err) {
            console.error("CRITICAL: Janitor loop failed:", err);
        }
    }, 5000);
}