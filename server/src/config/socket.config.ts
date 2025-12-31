import { Server, Socket } from "socket.io" 
import { findMatch } from "../services/socket.services.js";
import { SocketResponse } from "../types/socket.types.js";

class SocketService {
    private _socket: Socket;

    constructor (socket: Socket) {
        this._socket = socket
    }

    // Used to emit socket events
    newEmitter<T = unknown>(event: string, data: T) {
        
        return this._socket.emit(event, data);
    };

    // Used to listen for events
    newListener<T = unknown>(event: string, callback: (args: T, response: SocketResponse) => void) {
        console.log(this._socket)
        return this._socket.on(event, callback);
    }; 
}

/**
 * Initializes socket.io and makes it possible to listen for events
 * @param io 
 */
export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        
        // ====== Matchmaking ====== \\
        socket.on("find_match", findMatch)
    });
};
 
