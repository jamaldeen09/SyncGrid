import { GameStateContextInitialState } from "@/contexts/GameStateContext";
import { callToast } from "@/providers/SonnerProvider";
import { LiveGame } from "@shared/index";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

// ===== Connections ===== \\
export const onConnection = () => {
    console.log(`✅ Connected`);
}

// ===== Disconnections ===== \\
export const onDisconnection = () => console.log("❌ Disconnected");

// ==== Connection errors ===== \\
export const onConnectionErr = (err: unknown) => {
    console.log(err);
    callToast.offline();
}

// ===== Reconnections ===== \\
export const onReconnection = (attempt: number) => {
    console.log(`Reconnected to server on attempt: ${attempt}`);
    callToast.online();
};


// ===== Reconnection attempt ===== \\
export const onReconnectionAttempt = (attempt: number) => {
    console.log(`Attempting to reconnect...\nCurrent attempt: ${attempt}`);
    callToast.reconnecting();
}

// ===== Reconnection failed ===== \\
export const onReconnectionFailed = () => {
    console.log("❌ Reconnection failed after all attempts");
    callToast.offline();
}

// ===== Reconnection error ===== \\
export const onReconnectionError = (err: unknown) => console.error(`Reconnection error\n${err}`);

// ===== Matchmaking ===== \\
export const onFoundOpponent = (
    gameId: string,
    router: AppRouterInstance,
    setIsFindingMatch: React.Dispatch<React.SetStateAction<boolean>>
) => {
    console.log("FOUND OPPONENT, GAME ID: ", gameId);
    setIsFindingMatch(false);

    // Route the user to the game
    router.push(`/game/live/${gameId}`);
};


export const onGameEnded = (payload: {
    result: LiveGame["result"];
    status: LiveGame["status"];
    winner: string | null;
    message: string;
}, setLiveGameData: React.Dispatch<React.SetStateAction<LiveGame | null>>) => {

    setLiveGameData((prevState) => {
        if (!prevState) return prevState;

        return ({
            ...prevState,
            ...payload
        })
    });
};

export const onMoveRegistered = (payload: {
    result: "decisive" | "draw" | "pending"
    updatedMoves: LiveGame["moves"];
    currentTurn: "X" | "O";
    players: LiveGame["players"];
    winner: string | null;
}, setLiveGameData: React.Dispatch<React.SetStateAction<LiveGame | null>>,
    fillBoard: (args: { value: "X" | "O"; boardLocation: number }[]) => void,
    setGameStatus: GameStateContextInitialState["setGameStatus"],
    currentUserId: string,
) => {
    setLiveGameData((prevState) => {
        if (!prevState) return prevState;

        return ({
            ...prevState,
            moves: payload.updatedMoves,
            currentTurn: payload.currentTurn,
            players: payload.players 
        })
    });

    // Fill the board
    fillBoard(payload.updatedMoves.map((move) => ({
        value: move.value,
        boardLocation: move.boardLocation,
    })));

    // Update game status that controls winning/losing ui
    if (payload.result && payload.result === "draw")
        return setGameStatus("draw")   

    if ((payload.result && payload.result === "decisive") && (payload.winner)) {
        if (currentUserId === payload.winner) 
            return setGameStatus("won");

        return setGameStatus("lost")
    }
};

export const onStatusUpdate = (payload: {
    status: "won" | "lost" | "draw" | "canceled";
}, setGameStatus: GameStateContextInitialState["setGameStatus"]) => setGameStatus(payload.status);