import { Socket, Server } from "socket.io";
import { EventType } from "@shared/index";


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
    newListener<TArgs = unknown>(
        event: EventType[keyof EventType],
        callback: (args: TArgs) => void | Promise<void>,
    ) {
        this._socket.on(event, callback);
    };

    /**
     * Creates a new emitter
     * @param event 
     * @param data 
     */
    newEmitter<TData = unknown>(
        event: EventType[keyof EventType],
        data: TData,
    ) {
        this._socket.emit(event, data);
    }
}



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

