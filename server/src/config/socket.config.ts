import { Server } from "socket.io";
import { GamePlayService,  MatchmakingService, SocketService } from "../services/socket.service.js";
import { events } from "../lib/events.js";


export const initSocket = (io: Server) => {
    return io.on("connection", (socket) => {
        // Socket service
        const socketService = new SocketService(io, socket);

        // Matchmaking service
        const matchmakingService = new MatchmakingService(io, socket);

        // Game play service
        const gamePlayService = new GamePlayService(io, socket);

        console.log("SOCKET.ID: ", socket.id)

        socket.on("connect", () => {
            console.log("RECEIVED A NEW CONNECTION: ", socket.id);
        });

        socket.on("disconnection", (args: {
            userId: string
        }) => {

        });

        // ===== Finds an opponent for the requesting user ===== \
        socketService.newListener<{
            userId: string,
            preference: "X" | "O",
        }>(events.findOpponent, (args, callback) => matchmakingService.findOpponent(args, callback));

        // ===== Listens for requests to get a live game ===== \\
        socketService.newListener<{
            gameId: string
        }>(events.getLiveGame, (args, callback) => gamePlayService.getLiveGame(args, callback));

        // ===== New move ===== \\
        socketService.newListener<{
            gameId: string;
            userId: string;
            winner: string | null;
            moveData: {
                value: "X" | "O";
                boardLocation: number
            }
        }>(events.newMove, (args, callback) => gamePlayService.newMove(args, callback))
    });
}

