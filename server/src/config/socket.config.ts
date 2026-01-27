import { Server } from "socket.io";
import { SocketService } from "../services/socket.service.js";
import { events } from "../lib/events.js";
import { MatchmakingService } from "../services/matchmaking.service.js";
import { NewMoveArgs } from "@shared/index.js";
import { GamePlayService } from "../services/game-play.service.js";
import jwt from "jsonwebtoken"
import { envData } from "./env.config.js";
import { AccessTokenPayload } from "../types/auth.types.js";
import { ConfiguredSocket } from "../types/socket.types.js";
import { redisService } from "../services/redis.service.js";

export const initSocket = (io: Server) => {

    // Global middlewares
    io.use((socket, next) => {
        let errorObj: ({ name: string; message: string; }) | undefined;
        const token = socket.handshake.auth.token;

        // Token does not exist
        if (!token) {
            errorObj = ({
                name: "AUTHENTICATION_ERROR",
                message: "Token missing",
            });

            return next(errorObj);
        }


        // Verify the provided token
        jwt.verify(token, envData.ACCESS_TOKEN_SECRET, (err: unknown, decoded: unknown) => {
            if (err instanceof jwt.TokenExpiredError) {
                errorObj = ({
                    name: "EXPIRED_TOKEN",
                    message: "Token has expired"
                });

                return next(errorObj)
            }

            if (err instanceof jwt.JsonWebTokenError) {
                errorObj = ({
                    name: "INVALID_TOKEN",
                    message: "Invalid token"
                });

                return next(errorObj)
            }

            const typedDecoded = decoded as AccessTokenPayload;
            (socket as ConfiguredSocket).user = ({
                userId: typedDecoded.userId,
                tokenVersion: typedDecoded.tokenVersion,
                email: typedDecoded.email,
            });

            return next();
        });
    });

    io.on("connection", (socket) => {
        // Socket service
        const socketService = new SocketService(io, socket);

        // Matchmaking service
        const matchmakingService = new MatchmakingService(socket);

        // Game play service
        const gamePlayService = new GamePlayService(io, socket);

        // ** ===== LISTENERS ===== ** \\

        // ** CONNECTION AND DISCONNECTION
        console.log("Received a new connection");
        console.log("Connection's sid: ", socket.id);

        socket.on("disconnect", async () => {
            try {
                const userId = (socket as ConfiguredSocket).user.userId;

                await Promise.allSettled([
                    redisService.deleteOperation(`searching:${userId}`),
                    redisService.deleteOperation(`user-socket:${userId}`),
                    redisService.matchmakingQueueOperation(events.matchmakingQueue.X, "remove", userId),
                    redisService.matchmakingQueueOperation(events.matchmakingQueue.O, "remove", userId)
                ]);

                console.log(`Connection with sid: ${socket.id} has disconnected`);
            } catch (err) {
                console.error("Disconnection err: ", err);
            }
        })

        // ** MATCHMAKING

        // Listens for requests to find an opponent
        socketService.newListener<{
            preference: "X" | "O",
        }>(events.findOpponent, (args, callback) => matchmakingService.findOpponent(({
            ...args,
            socketService,
        }), callback));

        // Listens for requests to cancel the search for an opponent
        socketService.newListener<{
            preference: "X" | "O"
        }>(events.cancelMatchmaking, (args, callback) => matchmakingService.cancelOpponentSearch(({
            ...args,
            socketService
        }), callback));


        // ** GAME PLAY

        // Listnes for requests to get the live data of a game
        socketService.newListener<{ gameId: string }>(events.getLiveGame,
            (args, callback) => gamePlayService.getLiveGame({
                ...args,
                socketService,
            }, callback));


        // Listens for requests to make a new move in a game
        socketService.newListener<NewMoveArgs>(
            events.newMove,
            (args, callback) => gamePlayService.newMove(({
                ...args,
                socketService,
            }), callback)
        );

        // Listens for requests to get banner live game
        socketService.newListener<{
            gameId: string
        }>(events.bannerLiveGame,
            (args, callback) => gamePlayService.getBannerLiveGame(args, callback)
        )

        // Listens for status updates for instantaneous ui update
        socketService.newListener<{
            status: "won" | "lost" | "draw" | "canceled";
            gameId: string; 
        }>(events.statusUpdate,
            (args) => gamePlayService.statusUpdateForOpponent(args, socketService)
        );
    });
}

