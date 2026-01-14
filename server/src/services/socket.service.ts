import { Server, Socket } from "socket.io";
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
