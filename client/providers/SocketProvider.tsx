"use client"
import { useGameState } from "@/contexts/GameStateContext";
import { useMatchmaking } from "@/contexts/MatchmakingContext";
import {
    onConnection,
    onDisconnection,
    onFoundOpponent,
    onGameEnded,
    onMoveRegistered,
    onReconnection,
    onReconnectionAttempt,
    onReconnectionError,
    onReconnectionFailed,
    onStatusUpdate
} from "@/lib/socket/event-listeners";
import { events } from "@/lib/socket/events";
import socket from "@/lib/socket/socket";
import { useAppSelector } from "@/redux/store";
import { LiveGame } from "@shared/index";
import { useRouter } from "next/navigation";
import React, { useEffect, } from "react";


const SocketProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // Hooks
    const router = useRouter();
    const { setIsFindingMatch } = useMatchmaking();
    const { 
        setLiveGameData, 
        fillBoard, 
        setGameStatus,
    } = useGameState();

    // Current user id
    const currentUserId = useAppSelector((state) => state.user.auth.userId);

    // ** ===== WRAPPERS ===== ** \\

    // Matchmaking
    const foundOpponent = (args: { gameId: string }) => onFoundOpponent(args.gameId, router, setIsFindingMatch);
    const matchmakingErr = () => setIsFindingMatch(false);

    // Gameplay
    const gameEnded = (payload: {
        result: LiveGame["result"];
        status: LiveGame["status"];
        winner: string | null;
        message: string;
    }) => onGameEnded(payload, setLiveGameData);

    // On move registered
    const moveRegistered = (payload: {
        result: "decisive" | "draw" | "pending"
        updatedMoves: LiveGame["moves"];
        currentTurn: "X" | "O";
        players: LiveGame["players"];
        winner: string | null;
    }) => onMoveRegistered(payload, setLiveGameData, fillBoard, setGameStatus, currentUserId);

    const statusUpdate = (payload: { status: "won" | "lost" | "draw" | "canceled"}) => onStatusUpdate(payload, setGameStatus)

    // ===== Set up socket event listeners when this component mounts ===== \\
    useEffect(() => {
        // Manually connects when this component mounts
        if (!socket.connected) socket.connect()
 
        // ===== Connection ===== \\
        socket.on("connect", onConnection);
        socket.on("disconnect", onDisconnection);

        // ===== Reconnection =====
        socket.io.on("reconnect", onReconnection);
        socket.io.on("reconnect_error", onReconnectionError);
        socket.io.on("reconnect_failed", onReconnectionFailed);
        socket.io.on("reconnect_attempt", onReconnectionAttempt);

        // ====== Matchmaking ===== \\
        socket.on(events.foundOpponent, foundOpponent);
        socket.on(events.matchmakingErr, matchmakingErr);

        // ===== Game play ===== \\
        socket.on(events.gameEnded, gameEnded);
        socket.on(events.moveRegistered, moveRegistered);
        socket.on(events.statusUpdate, statusUpdate)

        // Remove listeners when this component unmounts
        return () => {
            // ===== Connection and disconnection ===== \\
            socket.off("connect", onConnection);
            socket.off("disconnect", onDisconnection);

            // ===== Reconnection ===== \\
            socket.io.off("reconnect", onReconnection);
            socket.io.off("reconnect_error", onReconnectionError);
            socket.io.off("reconnect_failed", onReconnectionFailed);
            socket.io.off("reconnect_attempt", onReconnectionAttempt);

            // ===== Matchmaking ===== \\
            socket.off(events.foundOpponent, foundOpponent);
            socket.off(events.matchmakingErr, matchmakingErr);

            // ===== Game play ===== \\
            socket.off(events.gameEnded, gameEnded);
            socket.off(events.moveRegistered, moveRegistered)
            socket.off(events.statusUpdate, statusUpdate)
        }
    }, []);


    return <>{children}</>
};

export default SocketProvider;