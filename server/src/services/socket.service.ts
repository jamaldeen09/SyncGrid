import { Server, Socket } from "socket.io";
import { Listener } from "@shared/types/socket.types.js";

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
        const emitterBeingUsed = emitter === "io" ? this._io : this._socket;

        if (emission === "to-room-emission") {
            // Using this._io.to(room).emit() is the safest way to target 
            // a specific socket ID (since every socket is in a room named after its ID)
            emitterBeingUsed.to(room!).emit(event, data);
            return;
        }

        if (emission === "normal-emission") {
            emitterBeingUsed.emit(event, data);
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

