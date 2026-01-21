import { UiContextType } from "@/contexts/UiContext";
import { newMove, setLiveGame } from "@/redux/slices/game-slice";
import { AppDispatch } from "@/redux/store";
import { LiveGame } from "@shared/index";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// ===== Connections ===== \\
export const onConnection = () => console.log(`✅ Connected`);

// ===== Disconnections ===== \\
export const onDisconnection = () => console.log("❌ Disconnected");

// ===== Reconnections ===== \\
export const onReconnection = (attempt: number) => console.log(`Reconnected to server on attempt: ${attempt}`);

// ===== Reconnection attempt ===== \\
export const onReconnectionAttempt = (attempt: number) => {
    console.log(`Attempting to reconnect...\nCurrent attempt: ${attempt}`);
}

// ===== Reconnection failed ===== \\
export const onReconnectionFailed = () => console.log("❌ Reconnection failed after all attempts");

// ===== Reconnection error ===== \\
export const onReconnectionError = (err: unknown) => console.error(`Reconnection error\n${err}`);

// ===== Matchmaking ===== \\
export const onFoundOpponent = (gameId: string, router: AppRouterInstance, closeUi: UiContextType["closeUi"]) => {
    closeUi("searchingForOpponent");
    const url = `/game/${gameId}`;
    router.push(url);
};

// ===== Game play ===== \\
export const onMoveRegistered = (game: LiveGame, dispatch: AppDispatch) => {
    // dispatch(newMove(moves));
    // console.log("RECEIVED MOVES: ", moves)

    console.log("RECEIVED GAME: ", game);
    dispatch(setLiveGame(game));
}