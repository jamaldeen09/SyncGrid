import { Server } from "socket.io";
import { SocketService } from "../services/socket.service.js";


export const initSocket = (io: Server) => {
    return io.on("connection", (socket) => {
        // Socket service
        const socketService = new SocketService(io, socket);
        
        socket.on("connection", () => {
            console.log("RECEIVED A NEW CONNECTION: ", socket.id);
        });

        // Ping
        socketService.newListener<{ ping: string }>("ping", (args) => {
            console.log(`PING RECEIVED\nMESSAGE: ${args.ping}`);
            socketService.newEmitter("pong", { pong: "This is my pong message" });
        });
    });
}

