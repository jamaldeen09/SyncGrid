"use client"
import { events } from "@/lib/socket/events";
import socket from "@/lib/socket/socket";
import { winningCombinations } from "@/lib/utils";
import { callToast } from "@/providers/SonnerProvider";
import { useLazyGetGameQuery } from "@/redux/apis/game-api";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ActiveOrFinishedGameData, ListenerCallbackArgs, LiveGame, NewMoveArgs } from "@shared/index";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Contexts initial state
export interface GameStateContextInitialState {
    board: ("X" | "O" | null)[];
    newMove: (boardLocation: number, move: "X" | "O", currentUserId: string) => void;
    fillBoard: (moves: ({
        value: "X" | "O",
        boardLocation: number
    })[]) => void;
    resetBoard: () => void;

    gameData: ActiveOrFinishedGameData | null;
    resetGameData: (game: "live" | "stored") => void;
    gettingLiveGame: boolean;
    gameStatus: "active" | "won" | "lost" | "draw" | "canceled";
    setGameStatus: React.Dispatch<React.SetStateAction<GameStateContextInitialState["gameStatus"]>>;
    calculateResult: (board: ("X" | "O" | null)[]) => ({
        winner: "X" | "O" | null;
        winningCombination: [number, number, number] | null;
    });

    gameFetchApiService: ({
        executeService: (gameId: string, gameType: "live-game" | "finished-game") => void;
        isLoading: boolean;
        isFetching: boolean;
        error: FetchBaseQueryError | SerializedError | undefined;
        isError: boolean;
        isSuccess: boolean;
    })

    liveGameData: LiveGame | null;
    setLiveGameData: React.Dispatch<React.SetStateAction<LiveGame | null>>
    liveGameFetchErrMsg: string | null;
    getLiveGame: (gameId: string, currentUserId: string) => void;
}

// Actual context
export const GameStateContext = createContext<GameStateContextInitialState | null>(null);

// Context provider
export const GameStateContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // Local states
    const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
    const [liveGameData, setLiveGameData] = useState<LiveGame | null>(null); // handles live game data
    const [gameData, setGameData] = useState<ActiveOrFinishedGameData | null>(null); // handles displaying data for the games (finished / active)
    const [gettingLiveGame, setGettingLiveGame] = useState<boolean>(true);
    const [liveGameFetchErrMsg, setLiveGameFetchErrMsg] = useState<string | null>(null)
    const [gameStatus, setGameStatus] = useState<"active" | "won" | "lost" | "draw" | "canceled">("active");


    // ===== Api service that handles game data ===== \\
    const [fetchGame, {
        isLoading,
        isError,
        isSuccess,
        error,
        data,
        isFetching
    }] = useLazyGetGameQuery();

    // Execute service function to trigger the http request to fetch
    // game data
    const executeService = useCallback(async (gameId: string, gameType: "live-game" | "finished-game") => {
        const result = await fetchGame({ gameId, gameType }).unwrap();

        // Initialize game data immedately to bypass caching
        if (result.success && result.data) {
            const data = result.data as ({
                game: ActiveOrFinishedGameData
            });

            setGameData(data.game);
        }
    }, [fetchGame]);


    // UseEffect to set game data if .unwrap() logic somehow gets bypassed
    useEffect(() => {
        if (isSuccess) {
            const resData = data.data as ({ game: ActiveOrFinishedGameData });
            setGameData(resData.game);
        }
    }, [isSuccess, data]);

    // ** ===== Helper functions ===== ** \\

    // Fills the board (incase of previous moves)
    const fillBoard = useCallback((moves: ({
        value: "X" | "O",
        boardLocation: number
    })[]) => {

        // Set the moves directly if they are exactly 9
        setBoard((prevState) => {
            const newBoardState = [...prevState];

            // Loop through the moves
            moves.forEach((move) => {
                if (move.boardLocation < newBoardState.length)
                    newBoardState[move.boardLocation] = move.value;
            });
            return newBoardState
        })
    }, []);

    // Resets the board
    const resetBoard = useCallback(() => setBoard(Array(9).fill(null)), []);

    // Function to get live game
    const getLiveGame = useCallback((gameId: string, currentUserId: string) => {
        setLiveGameFetchErrMsg(null);
        resetBoard();

        socket.emit(events.getLiveGame, ({
            gameId
        }), (response: ListenerCallbackArgs) => {
            setGettingLiveGame(false);

            if (!response.success)
                return setLiveGameFetchErrMsg(response.message);

            setLiveGameFetchErrMsg(null);
            const data = response.data as ({ liveGame: LiveGame });
            setLiveGameData(data.liveGame);
            fillBoard(data.liveGame.moves.map((move) => ({
                value: move.value,
                boardLocation: move.boardLocation
            })));

            // ** Handles brief 5 second time frame before server negates the game
            // out of existence 🤣
            if (data.liveGame.status === "canceled") 
                return setGameStatus("canceled");
    
            if (data.liveGame.winner) {                
                if (data.liveGame.winner === currentUserId) setGameStatus("won");
                if (data.liveGame.winner !== currentUserId) setGameStatus("lost");
            }
        });
    }, [fillBoard, resetBoard]);

    // Resets game data (live or stored)
    const resetGameData = (game: "live" | "stored") => useCallback(() => {
        if (game === "stored") return setGameData(null);
        setLiveGameData(null);
    }, []);

    // Calculates if "X" or "O" won
    const calculateResult = useCallback((board: ("X" | "O" | null)[]): ({
        winner: "X" | "O" | null;
        winningCombination: [number, number, number] | null
    }) => {
        for (const [a, b, c] of winningCombinations) {
            if ((board[a] && board[a] === board[b]) && (board[a] === board[c])) {
                return ({
                    winner: board[a],
                    winningCombination: [a, b, c]
                })
            }
        };

        return ({ winner: null, winningCombination: null })
    }, []);


    // Makes a new move on the board
    const newMove = useCallback((boardLocation: number, move: "X" | "O", currentUserId: string) => {
        if (
            // game (possibly finished)
            (!gameData || gameData.status === "finished") ||

            // live game
            (!liveGameData || liveGameData.moves.length >= 9) ||
            (liveGameData.currentTurn !== move) ||
            (liveGameData.winner || liveGameData.result === "decisive" || liveGameData.result === "draw") ||

            // 
            (board[boardLocation] !== null)
        ) return;

        // Update board
        let currBoardState = [...board];
        currBoardState[boardLocation] = move;
        setBoard(currBoardState)

        // Calculate the winner
        const result = calculateResult(currBoardState);

        // Save the current live game data state (before an update)
        const currentLiveGameDataState = liveGameData;

        // Emit via socket
        const winner = liveGameData.players.find((player) => player.preference === result.winner);
        socket.emit(events.newMove, {
            gameId: liveGameData._id,
            moveData: ({ value: move, boardLocation }),
            winner: winner ? winner.userId : null,
        } as NewMoveArgs, (response: ListenerCallbackArgs) => {
            if (!response.success) {
                // Reverse move if somehow we got an error response
                // because the move gets mounted quickly
                callToast.error(response.message)
                return setLiveGameData(currentLiveGameDataState);
            }
        });

        // Move was played by?
        const moveWasPlayedBy = liveGameData.players.find((player) => player.preference === move)?.userId;

        // Update the game state quickly
        const newMoves = [...liveGameData.moves, {
            playedAt: new Date(),
            playedBy: moveWasPlayedBy || "",
            value: move,
            boardLocation,
        }];

        setLiveGameData((prevState) => {
            if (!prevState) return prevState;

            return ({
                ...prevState,
                moves: newMoves,
                lastMoveAt: Date.now(),
                winner: winner?.userId || null,
                currentTurn: (liveGameData.currentTurn === "X" ? "O" : "X")
            })
        });

        // Handle draws
        if (newMoves.length === 9 && !winner) {
            setGameStatus("draw");
            socket.emit(events.statusUpdate, {
                gameId: liveGameData._id,
                status: "draw"
            });
        }
    
        // Handle wins
        const isCurrentUserWinner = currentUserId === winner?.userId;
        if (winner) {
            setGameStatus(isCurrentUserWinner ? "won" : "lost")
            socket.emit(events.statusUpdate, {
                gameId: liveGameData._id,
                status: isCurrentUserWinner ? "lost" : "won"
            });
        }
    }, [liveGameData, board, gameData, calculateResult]);

    // ===== Context values ===== \\
    const contextValues = useMemo(() => ({
        board,
        newMove,
        fillBoard,
        calculateResult,

        gameData,
        resetGameData,
        gameFetchApiService: ({
            isLoading,
            isError,
            isFetching,
            error,
            executeService,
            isSuccess,
        }),

        liveGameData,
        setGameStatus,
        gameStatus,
        getLiveGame,
        setLiveGameData,
        gettingLiveGame,
        liveGameFetchErrMsg,
        resetBoard,
    } as GameStateContextInitialState), [
        board,
        newMove,
        fillBoard,
        calculateResult,
        resetGameData,
        isLoading,
        isFetching,
        isError,
        gettingLiveGame,
        error,
        resetBoard,
        executeService,
        liveGameData,
        getLiveGame,
        isSuccess,
        gameStatus,
        liveGameFetchErrMsg
    ])
    return (
        <GameStateContext.Provider value={contextValues}>
            {children}
        </GameStateContext.Provider>
    )
};

// Hook to use the context
export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context)
        throw new Error("useGameState must be used within a GameStateContextProvider");

    return context;
}