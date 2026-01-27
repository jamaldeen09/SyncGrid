import { Server, Socket } from "socket.io";
import { redisService } from "./redis.service.js";
import { SocketService } from "./socket.service.js";
import { ListenerCallback, LiveGame } from "@shared/index";
import { events } from "../lib/events.js";
import { gameService } from "./game.service.js";
import { ConfiguredSocket } from "../types/socket.types.js";

// ===== Matchmaking service ===== \\
export class MatchmakingService {
    private _socket: Socket;

    constructor(socket: Socket) {
        this._socket = socket;
    }

    /**
     * This finds an opponent in a matchmaking queue
     * for the requesting socket/user
     * @param args 
     * @param callback 
     */
    async findOpponent(args: {
        preference: "X" | "O";
        socketService: SocketService;
    }, callback: ListenerCallback) {
        // User's id from socket session
        const userId = (this._socket as ConfiguredSocket).user.userId;

        try {
            // Queue keys
            let findingOpponentQueueKey = events.matchmakingQueue.X;
            let queueKey = events.matchmakingQueue.X

            // This determines the queue a user is going to be in
            // (queueKey) and the queue the user is going to search in
            // (findOpponentQueueKey)
            switch (args.preference) {
                case "X":
                    findingOpponentQueueKey = events.matchmakingQueue.O;
                    queueKey = events.matchmakingQueue.X;
                    break;

                case "O":
                    findingOpponentQueueKey = events.matchmakingQueue.X;
                    queueKey = events.matchmakingQueue.O;
                    break;
            }

            // the key: "searching:[userId]" is used to know if a specific user is currently
            // searching for an opponet and the key "user-socket:[userId] stores
            // a specific user's socketId (useful for emitting to a specific socket)
            // ** (this is atomic because they are extremely critical keys)

            const FIVE_MINUTES = 300;
            await Promise.all([
                redisService.writeOperation(`searching:${userId}`, "true", 300),
                redisService.writeOperation(`user-socket:${userId}`, this._socket.id, 300),
            ]);

            // This determines if there are opponents waiting in a queue
            // which was determined by the requesting socket's play preference
            // it's useful because if there aren't anyone in the queue
            // we can easily store the requesting socket in it's respected queue
            // so other users can find it
            const totalWaiting = await redisService.matchmakingQueueOperation(
                findingOpponentQueueKey, "get-length") as number;

            // This condition simply checks if the total number of people
            // in the determined queue is >= 1 (which indicates a user is indeed)
            // in the queue
            if (totalWaiting >= 1) {
                let matchFound = false;

                while (!matchFound) {
                    // After confirming a user exists in the determine queue we
                    // grab the user's id from the queue (which is what is being stored)
                    // and we grab their socket id using the key "user-socket[userId]"
                    // (we grab their socket id to make it known to that socket/user that an opponent was found)
                    const grabbedUserId = await redisService.matchmakingQueueOperation(findingOpponentQueueKey, "grab-last") as string
                    const grabbedUserSocketId = await redisService.readOperation(`user-socket:${grabbedUserId}`);

                    console.log("GRABBED USER SOCKET ID:", grabbedUserSocketId);

                    // ** ATOMIC CHECK: Is the current user (userId) still searching?
                    // This critical check helps prevent race conditions when a user "cancels"
                    // the search. If the current socket/the grabbed user from the queue 
                    // clicks cancel we check if both users are still "searching" using 
                    // the key: "searching:[userId]"
                    const [isRequesterStillHere, isGrabbedStillHere] = await Promise.all([
                        redisService.readOperation(`searching:${userId}`),
                        redisService.readOperation(`searching:${grabbedUserId}`)
                    ]);

                    // If none of them are "searching" again then that means they clicked "cancel"
                    // if that is the case IF the person that clicked cancel is the user 
                    // that was grabbed from the matchmaking queue we add them back to the queue
                    // for fairness, otherwise we just stop the function from running further
                    // (in the frontend the requester most likely clicked "cancel" and that function
                    //  handles messages so we do not need to send another one here)
                    if (!isRequesterStillHere || !isGrabbedStillHere) {

                        // ** Condition to check if the grabbed user is still searching
                        // ** for an opponent
                        if (isGrabbedStillHere)
                            await redisService.matchmakingQueueOperation(
                                findingOpponentQueueKey, "add", grabbedUserId
                            );

                        return;
                    }

                    // (await this._io.in(grabbedUserSocketId).fetchSockets()).length <= 0

                    // IF somehow the user from the matchmaking queue dosen't have a socket id
                    // stored in redis (this means they most likely disconnected or the socket id
                    // does not belong to them) then we re run the function creating a sort of
                    // recursion which simply just checks for another user and ignores this 
                    // user with the ghost socket id
                    if (!grabbedUserSocketId) {
                        // ** RECURSION: Try to find the next available person 
                        console.log(`Ghost user ${grabbedUserId} found. Popping next...`);
                        continue;
                    };

                    // If all conditions were met then we simply create the 
                    // game in the database
                    const newGame = await gameService.createGame({
                        players: [
                            { userId: userId, preference: args.preference },
                            { userId: grabbedUserId, preference: args.preference === "X" ? "O" : "X" }
                        ],

                        gameSettings: {
                            visibility: "public",
                            status: "active"
                        } 
                    });

                    // The created game's id converted to a string (because it was initially an ObjectId)
                    const gameId: string = newGame._id.toString();

                    console.log("ALL CONDITIONS PASSED CREATED GAME: ", newGame);

                    // This is the live game that gets updated each time something happens
                    // e.g a new move, a winner etc.. It's faster than making http requests
                    // to the db constantly and creates a smooth user experience
                    const liveGame: LiveGame = {
                        _id: gameId, 
                        timeLeftTillGameCanceledMs: 20000, // 20 secs
                        status: "active",  
                        winner: null,
                        currentTurn: "X",
                        result: "pending",
                        players: newGame.players.map((player) => ({
                            userId: player.userId.toString(),  
                            preference: player.preference,
                            timeLeftMs: 60000,
                        })),
                        moves: [],
                        createdAt: newGame.createdAt,
                        lastMoveAt: null,
                    };

                    // Stores the game in redis using "live-game:[gameId]" key
                    await redisService.writeOperation<LiveGame>(`live-game:${gameId}`, liveGame);

                    // ** ATOMIC DELETION
                    // deleting the "searching:[userId]" key is a very critical
                    // thing because the key is important, this makes sure nothing else happens till
                    // the keys are properly deleted (FOR BOTH USERS) indicating none of them
                    // are matchmaking again
                    await Promise.all([
                        redisService.deleteOperation(`searching:${userId}`),
                        redisService.deleteOperation(`searching:${grabbedUserId}`),
                    ]);

                    // This emits the game id to the frontend
                    // because the game route is "/game/[gameId]" in Next.js
                    // so it's easier to just route the grabbed user or the user found 
                    // in the queue to that route
                    args.socketService.newEmitter(
                        events.foundOpponent,  // event
                        { gameId },  // data being emitted
                        "io",  // emitter (io or socket)
                        "to-room-emission", // emission type
                        grabbedUserSocketId || "", // room to emit to
                    );

                    // This emits to the requester or the current socket
                    // the game's id rather than the user found in the queue
                    args.socketService.newEmitter(events.foundOpponent, { gameId }, "socket", "normal-emission");
                    matchFound = true;  
                    return;
                }
            } else {
                // IF no user's were found in the determined matchmaking queue
                // then simply add the requesting socket to their respected
                // queue so other user's can find them
                await redisService.matchmakingQueueOperation(queueKey, "add", userId);

                // Return a response to indicate that 
                // we are searching for an opponent
                return callback({
                    success: true,
                    message: "Searching for an opponent...",
                })
            }
        } catch (err) {
            // Error handling
            console.error(`Opponent search error\nFile: matchmaking.service.ts\nMethod: findOpponent\n${err}`);
            args.socketService.newEmitter(events.matchmakingErr, undefined, "socket", "normal-emission");

            // Delete critical keys if any error occurs to prevent
            // having stale keys in redis because "searching:[userId]" and "user-socket:[userId]" keys
            // do not have ttl's which is safer to avoid deleting a searching user's key because
            // we do not know how long the user might search for
            await Promise.all([
                redisService.deleteOperation(`searching:${userId}`),
                redisService.deleteOperation(`user-socket:${userId}`),
            ]);

            // Response
            return callback({
                success: false,
                message: "Something went wrong, please try again shortly",
            })
        }
    };

    /**
     * Cancels matchmaking for the requesting socket
     * or user
     * @param args 
     * @param callback 
     */
    async cancelOpponentSearch(args: {
        preference: "X" | "O",
        socketService: SocketService
    }, callback: ListenerCallback,) {

         // User's id from socket session
         const userId = (this._socket as ConfiguredSocket).user.userId;
        try {
            // This determines what queue the
            // user currently resides in (This helps to find the user so we can remove them)
            const queueKey = args.preference === "X" ? events.matchmakingQueue.X : events.matchmakingQueue.O;

            // ** CRITICAL
            // kills the "searching:[userId]" and "user-socket:[userId]" keys immediately which
            // removes any race conditions due to how the keys
            // are being used in the search for an opponent
            await redisService.deleteOperation(`searching:${userId}`);
            await redisService.deleteOperation(`user-socket:${userId}`);

            // This removes the user from the matchmaking queue
            await redisService.matchmakingQueueOperation(queueKey, "remove", userId) as number;

            // Return a response indicating their search has been canceled
            // successfully
            return callback({
                success: true,
                message: "Search has been canceled"
            })
        } catch (err) {
            // Error handling
            console.error(`Opponent search cancelation error\nFile: matchmaking.service.ts\nMethod: findOpponent\n${err}`);
            args.socketService.newEmitter(events.matchmakingErr, undefined, "socket", "normal-emission");

            return callback({
                success: false,
                message: "Failed to cancel opponent search",
            })
        };
    }
}