import { Server, Socket } from "socket.io";
import { Listener, ListenerCallback } from "@shared/types/socket.types.js";
import { LiveGame } from "@shared/index";
import { GameService } from "./game.service.js";
import { RedisService } from "../services/redis.service.js"
import { events } from "src/lib/events.js";

// ===== Socket service ===== \\
export class SocketService {
    private _io: Server;
    private _socket: Socket;

    // Constructor
    constructor(io: Server, socket: Socket) {
        this._io = io;
        this._socket = socket;
    };

    /**
     * Creates a new listener
     * @param event 
     * @param callback  
     */
    newListener<TArgs = unknown, TCallbackData = unknown, TCallbackError = unknown>(
        event: string,
        listener: Listener<TArgs, TCallbackData, TCallbackError>,
    ) {
        this._socket.on(event, listener);
    };

    /**
     * Creates a new emitter
     * @param event 
     * @param data 
     */

    newEmitter<TData = unknown>(
        event: string,
        data: TData,

        emitter: "io" | "socket",
        emission: "to-room-emission" | "normal-emission",
        room?: string,
    ) {
        // Emitter being used
        const emitterBeingUsed = emitter === "io" ? this._io : this._socket;

        switch (emission) {
            case "to-room-emission":
                emitterBeingUsed.to(room!).emit(event, data);
                break;

            case "normal-emission":
                emitterBeingUsed.emit(event, data)
        }
    };

    /**
     * Joins a room
     * @param room 
     */
    joinRoom(room: string) {
        this._socket.join(room)
    }
}

// Redis service
const redisService = new RedisService();

// Game service
const gameService = new GameService();

// ===== Matchmaking service ===== \\
export class MatchmakingService {
    private _socket: Socket;
    private _io: Server;

    constructor(io: Server, socket: Socket) {
        this._io = io;
        this._socket = socket;
    }

    // Socket service
    get socketService() {
        return new SocketService(this._io, this._socket);
    }

    async findOpponent(args: {
        userId: string;
        preference: "X" | "O"
    }, callback: ListenerCallback) {

        if (!args.userId) {
            return callback({
                success: false,
                message: "Failed to find opponent"
            })
        }

        // ===== Determine the queue key ===== \\
        let findingOpponentQueueKey = events.matchmakingQueue.wantAny;
        let queueKey = events.matchmakingQueue.X
        let opponentsPreference = "any";
        const socketService = this.socketService

        switch (args.preference) {
            case "X":
                findingOpponentQueueKey = events.matchmakingQueue.O;
                queueKey = events.matchmakingQueue.X,
                    opponentsPreference = "O";
                break;

            case "O":
                findingOpponentQueueKey = events.matchmakingQueue.X,
                    queueKey = events.matchmakingQueue.O
                opponentsPreference = "X"
                break;
        }


        // Check if anyone is waiting
        const totalWaiting = await redisService.matchmakingQueueOperation(findingOpponentQueueKey, "get-length") as number;

        if (totalWaiting >= 1) {
            const grabbedUser = await redisService.matchmakingQueueOperation<string>(findingOpponentQueueKey, "grab-last") as string
            const parsedGrabbedUser = JSON.parse(grabbedUser) as {
                userId: string;
                socketId: string;
            };

            // Create a new game containing the requesting user
            // and the grabbed user
            const newGame = await gameService.createGame({
                players: [{
                    userId: args.userId,
                    preference: args.preference,
                }, {
                    userId: parsedGrabbedUser.userId,
                    preference: (opponentsPreference === "any" ? (
                        args.preference === "X" ? "O" : "X"
                    ) : (opponentsPreference as "X" | "O"))
                }],

                gameSettings: {
                    visibility: "public",
                    status: "active"
                }
            });

            // Game id
            const gameId: string = newGame._id.toString();

            // Live game
            const liveGame: LiveGame = {
                _id: gameId,
                timeLeftTillGameCanceledMs: 20000, // 20 secs
                status: "active",
                winner: null,
                currentTurn: "X",
                players: newGame.players.map((player) => ({
                    userId: player.userId.toString(),
                    preference: player.preference,
                    timeLeftMs: 60000,
                })),
                moves: [],
            };

            // Store the game in redis to update its live game state consistently
            await redisService.writeOperation<LiveGame>(`live-game:${gameId}`, liveGame);

            // Emit the game id to the found user
            socketService.newEmitter(
                events.foundOpponent,  // event
                { gameId },  // data being emitted
                "io",  // emitter (io or socket)
                "to-room-emission", // emission type
                parsedGrabbedUser.socketId, // room to emit to
            );

            // Emit the game id to the current requesting socket
            socketService.newEmitter(
                events.foundOpponent,
                { gameId },
                "socket",
                "normal-emission",
            )
        } else {
            // Add the user to the matchmaking queue
            await redisService.matchmakingQueueOperation<{
                userId: string;
                socketId: string;
            }>(queueKey, "add", {
                userId: args.userId,
                socketId: this._socket.id
            });

            return callback({
                success: true,
                message: "Searching for an opponent...",
            })
        }
    }
}



// ===== Game play service ===== \\
export class GamePlayService {
    private _io: Server;
    private _socket: Socket;

    constructor (io: Server, socket: Socket) {
        this._io = io;
        this._socket = socket;
    }

    get socketService () {
        return new SocketService(this._io, this._socket)
    }

    /**
    * Provides the requesting socket with a live game
    * @param args 
    * @param callback 
    */
    async getLiveGame(args: { gameId: string }, callback: ListenerCallback<{ liveGame: LiveGame }>) {
        try {
            const key = `live-game:${args.gameId}`
            const rawLiveGame = await redisService.readOperation(key);

            // Check if game exists
            if (!rawLiveGame) {
                return callback({
                    success: false,
                    message: "Game was not found or is currently not active",
                });
            }

            // Add the socket requesting this live game into the game room
            this.socketService.joinRoom(`game-room:${args.gameId}`);

            return callback({
                success: true,
                message: "Game was been fetched successfully",
                data: { liveGame: JSON.parse(rawLiveGame) }
            });
        } catch (err) {
            console.error(`Live game fetch error\nFile: socket.service.ts\nFunction: getLiveGame()\n${err}`);
            return callback({
                success: false,
                message: "Failed to fetch game"
            })
        }
    }

    // { playedAt: Date, }
    async newMove (args: {
        gameId: string;
        userId: string;
        winner: string | null;
        moveData: {
            value: "X" | "O";
            boardLocation: number
        }
    }, callback: ListenerCallback) {
        if ((!args.gameId || !args.userId)) {
            return callback({
                success: false,
                message: "Move could not be registered"
            })
        }

        // Find the game before updating it ==== \\
        const rawGame = await redisService.readOperation(`live-game:${args.gameId}`);
        console.log("RAW GAME: ", rawGame)
        if (!rawGame) {
            return callback({
                success: false,
                message: "Game was not found"
            });
        }

        // Game move was made on
        const gameMoveWasMadeOn = JSON.parse(rawGame) as LiveGame;

        // Check if the requesting socket is a player in the game
        // or if the game has finished
        // if (
        //     (!gameMoveWasMadeOn.players.some((player) => player.userId === args.userId)) || 
        //     (gameMoveWasMadeOn.status === "finished") ||
        //     (gameMoveWasMadeOn.winner) || 
        //     (gameMoveWasMadeOn.moves.length >= 9) 
        // ) {
        //     return callback({
        //         success: false,
        //         message: "Game has either been completed or you do not have the permission to make a move"
        //     })
        // }

        // moves
        const moves = gameMoveWasMadeOn.moves;

        const updatedMoves: LiveGame["moves"] = [...moves, {
            ...args.moveData,
            playedAt: new Date(),
            playedBy: args.userId,
        }];

        console.log("UPDATED MOVES: ", updatedMoves)

        // ===== Updated game ===== \\
        const updatedGame: LiveGame = ({
            ...gameMoveWasMadeOn, 
            currentTurn: gameMoveWasMadeOn.currentTurn === "X" ? "O" : "X", // update current turn
            moves: updatedMoves,
            winner: (args.winner ? args.winner : null)
        });

        console.log("CURRENT TURN: ", updatedGame.currentTurn);
        console.log("UPDATED GAME WINNER: ", updatedGame.winner);

        // Update the game in redis
        await redisService.writeOperation<LiveGame>(`live-game:${args.gameId}`, updatedGame);

        // Add the socket requesting this live game into the game room (just incase)
        this.socketService.joinRoom(`game-room:${args.gameId}`);

        // Emit to both users 
        this.socketService.newEmitter(
            events.moveRegistered,
            { game: updatedGame },
            "io",
            "to-room-emission",
            `game-room:${args.gameId}`,
        );

        return callback({
            success: true,
            message: "Move has been registered"
        })
    }
}
