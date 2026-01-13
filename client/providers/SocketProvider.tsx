"use client"
import { 
    onConnection, 
    onDisconnection, 
    onReconnection, 
    onReconnectionAttempt, 
    onReconnectionError, 
    onReconnectionFailed 
} from "@/lib/socket/event-handlers";
import socket from "@/lib/socket/socket";
import React, { useEffect, useRef } from "react";

const SocketProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // Refs
    const connectionRef = useRef<boolean>(false)

    // ===== Set up socket event listeners when this component mounts ===== \\
    useEffect(() => {
        if (connectionRef.current) return;

        // Manually connects when this component mounts
        if (!socket.connected) socket.connect()

        // ===== Connection and disconnection ===== \\
        socket.on("connect", onConnection);
        socket.on("disconnect", onDisconnection);

        // ===== Reconnection =====
        socket.io.on("reconnect", onReconnection);
        socket.io.on("reconnect_attempt", onReconnectionAttempt);
        socket.io.on("reconnect_error", onReconnectionError);
        socket.io.on("reconnect_failed", onReconnectionFailed);

        
        // Set connection ref to true after setting up all listeners
        // (to prevent unnesary re renders)
        connectionRef.current = true

        // Remove listeners when this component unmounts
        return () => {
            // ===== Connection and disconnection ===== \\
            socket.off("connect", onConnection);
            socket.off("disconnect", onDisconnection);

            // ===== Reconnection =====
            socket.io.off("reconnect", onReconnection);
            socket.io.off("reconnect_attempt", onReconnectionAttempt);
            socket.io.off("reconnect_error", onReconnectionError);
            socket.io.off("reconnect_failed", onReconnectionFailed);
        }
    }, []);


    return <>{children}</>
};

export default SocketProvider;