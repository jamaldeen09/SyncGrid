"use client"
import { useUi } from "@/contexts/UiContext";
import {
    onConnection,
    onDisconnection,
    onFoundOpponent,
    onMoveRegistered,
    onReconnection,
    onReconnectionAttempt,
    onReconnectionError,
    onReconnectionFailed
} from "@/lib/socket/event-listeners";
import { events } from "@/lib/socket/events";
import socket from "@/lib/socket/socket";
import { useAppDispatch } from "@/redux/store";
import { LiveGame } from "@shared/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SocketProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    // App dispatch
    const dispatch = useAppDispatch();

    // Hooks
    const router = useRouter();
    const { closeUi } = useUi()

    // Refs
    const connectionRef = useRef<boolean>(false);

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


        // ====== Matchmaking ===== \\
        socket.on(
            events.foundOpponent,
            (args: { gameId: string }) => onFoundOpponent(args.gameId, router, closeUi)
        );

        // ===== Game play ===== \\
        socket.on(events.moveRegistered, (args: { game: LiveGame }) => onMoveRegistered(args.game, dispatch))

        // Set connection ref to true after setting up all listeners
        // (to prevent unnesary re renders)
        connectionRef.current = true

        // Remove listeners when this component unmounts
        return () => {
            // ===== Connection and disconnection ===== \\
            socket.off("connect", onConnection);
            socket.off("disconnect", onDisconnection);

            // ===== Reconnection ===== \\
            socket.io.off("reconnect", onReconnection);
            socket.io.off("reconnect_attempt", onReconnectionAttempt);
            socket.io.off("reconnect_error", onReconnectionError);
            socket.io.off("reconnect_failed", onReconnectionFailed);

            // ===== Matchmaking ===== \\
            socket.off(
                events.foundOpponent,
                (args: { gameId: string }) => onFoundOpponent(args.gameId, router, closeUi)
            );

            // ===== Game play ===== \\
            socket.on(events.moveRegistered, 
                (args: { game: LiveGame }) => onMoveRegistered(args.game, dispatch))
        }
    }, []);


    return <>{children}</>
};

export default SocketProvider;