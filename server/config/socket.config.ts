import { Server } from "socket.io" 


/**
 * Initializes socket.io and makes it possible to listen for events
 * @param io 
 */
export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("NEW CONNECTION: ", socket.id)
    });
}