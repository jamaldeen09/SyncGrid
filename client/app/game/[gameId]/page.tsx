"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Square } from "@/components/reusable/game/Square";
import Navbar from "@/components/main-page/Navbar";
import Player from "@/components/reusable/game/Player";
import GamePanel from "@/components/game/GamePanel";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import socket from "@/lib/socket/socket";
import { callToast } from "@/providers/SonnerProvider";
import { events } from "@/lib/socket/events";
import { ListenerCallbackArgs } from "@shared/index";
import { winningCombinations } from "@/lib/utils";
import { setLiveGame } from "@/redux/slices/game-slice";

const GamePage = (): React.ReactElement => {

    // AppDispatch
    const dispatch = useAppDispatch();

    //   Local states
    const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));

    // Global states
    const gameData = useAppSelector((state) => state.game.finishedGame);
    const userId = useAppSelector((state) => state.user.auth.userId);
    const liveGame = useAppSelector((state) => state.game.liveGame);

    // Function to get the current game's players
    const getPlayers = useCallback(() => {
        // Incase game dosen't exist
        if (!gameData) {
            return ({
                firstPlayerOrCurrentPlayer: null,
                secondPlayerOrOpponent: null
            })
        }

        const players = gameData.players;
        const isCurrentUserInGame = players.some((player) => player.userId === userId);
        const firstPlayerOrCurrentPlayer = players.find((player) => player.userId === userId);

        // Check if the current user is in the game
        if (!isCurrentUserInGame || !firstPlayerOrCurrentPlayer) {
            return ({
                firstPlayerOrCurrentPlayer: players[0],
                secondPlayerOrOpponent: players[1]
            })
        };

        return ({
            firstPlayerOrCurrentPlayer,
            secondPlayerOrOpponent: (players.find((player) => player.userId !== firstPlayerOrCurrentPlayer.userId))
        })
    }, [gameData, userId]);

    // ===== Game's players ===== \\
    const gamePlayers = getPlayers();

    // Get winner
    const getWinniningResult = (currentBoard: ("X" | "O" | null)[]) => {
        for (const [a, b, c] of winningCombinations) {
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], winningCombination: [a, b, c] };
            }
        }
        return { winner: null, winningCombination: null };
    };

    // New move
    const newMove = useCallback((index: number, value: "X" | "O") => {
        if (!socket.connected)
            return callToast("error", "You are currently offline");

        // Handle edcases for if a user somehow manages to try to make a move
        // even when live game has not been initialized yet
        if (!liveGame)
            return callToast("error", "Failed to register your move");

        if (liveGame.currentTurn !== value) return;

        // Update the board
        const currentBoardState = [...board];
        currentBoardState[index] = value;
        setBoard(currentBoardState);

        // Calculate the winner AFTER the board gets updated
        const result = getWinniningResult(currentBoardState);
        const winner = liveGame.players.find((player) => player.preference === result.winner);

        console.log("WINNER: ", winner);
        console.log("RESULT: ", result);


        // Send update request to the server first
        socket.emit(events.newMove, {
            userId,
            gameId: liveGame._id,
            winner: (winner?.userId || null),
            moveData: {
                value,
                boardLocation: index,
            }
        }, (response: ListenerCallbackArgs) => {
            if (!response.success)
                return callToast("error", response.message)
        });

        // Update state locally if there is a winner
        if (result.winner) {
            // dispatch(setLiveGame({
            //     ...liveGame,
            //     winner: (winner?.userId || null),
            //     currentTurn: liveGame.currentTurn === "X" ? "O" : "X"
            // }));

            // .... extra ui logic

            // Prevent further updates
            return;
        }


        dispatch(setLiveGame({
            ...liveGame,
            currentTurn: liveGame.currentTurn === "X" ? "O" : "X"
        }))
    }, [liveGame, socket, callToast]);

    useEffect(() => {
        if (!liveGame) return;

        // Update the board anytime live game changes
        const moves = liveGame.moves;
        let boardState = [...board]

        // Loop through each move and update it
        moves.forEach((move) => {
            boardState[move.boardLocation] = move.value
        });

        setBoard(boardState);
    }, [liveGame]);

    useEffect(() => {
        console.log("LIVE GAME CURRENT TURN: ", liveGame?.currentTurn)
    }, [liveGame])


    const [status, setStatus] = useState<"active" | "finished">("active");
    const [chat, setChat] = useState([
        { sender: "System", text: "Match started! Good luck." },
        { sender: "Opponent", text: "Good luck, have fun!" },
        { sender: "You", text: "You too. Prepare to lose! 😉" },
    ]);

    const handleSendMessage = (text: string) => {
        setChat((prev) => [...prev, { sender: "You", text }]);
    };

    const handleResign = () => {
        if (confirm("Are you sure you want to resign?")) {
            setChat((prev) => [...prev, { sender: "System", text: "You resigned the match." }]);
            setStatus("finished");
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* ===== Navbar ===== */}
            <Navbar fixed={false} />

            {/* ===== Main ===== */}
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col lg:flex-row gap-6 flex-1 p-4 max-w-7xl mx-auto">
                    {/* Left side (board view) */}
                    <div className="flex-1 flex flex-col items-center justify-center rounded-xl relative overflow-hidden group
                    gap-2 ">
                        <div className="w-full space-y-4 max-w-175">
                            {/* Opponent */}
                            <Player
                                username={gamePlayers.secondPlayerOrOpponent?.username || "syncgrid-user"}
                                preference={gamePlayers.secondPlayerOrOpponent?.preference || "X"}
                                profileUrl={gamePlayers.secondPlayerOrOpponent?.profileUrl}
                                currentWinStreak={gamePlayers.secondPlayerOrOpponent?.currentWinStreak}
                                disablePlayer={(!liveGame || !gamePlayers.secondPlayerOrOpponent) ? true : (liveGame.currentTurn !== gamePlayers.secondPlayerOrOpponent.preference)}
                            />

                            {/* ===== Center (actual board) ===== */}
                            <div className="w-full aspect-square shadow-2xl shadow-primary/5">
                                <div className="grid grid-cols-3 w-full h-full border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
                                    {board.map((value, i) => (
                                        <Square
                                            key={i}
                                            value={(!value ? i + 1 : value)}
                                            // disableSquare={((getWinniningResult()?.winner !== null))}
                                            onClick={() => {
                                                if (!gamePlayers.firstPlayerOrCurrentPlayer) return;
                                                newMove(i, gamePlayers.firstPlayerOrCurrentPlayer.preference);
                                            }}
                                            isWinningSquare={((getWinniningResult(board)?.winningCombination || []).some((val) => val === i)) || false}
                                            className="w-full! h-full!"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Current player */}
                            <Player
                                username={gamePlayers.firstPlayerOrCurrentPlayer?.username || "syncgrid-user"}
                                preference={gamePlayers.firstPlayerOrCurrentPlayer?.preference || "X"}
                                currentWinStreak={gamePlayers.firstPlayerOrCurrentPlayer?.currentWinStreak}
                                profileUrl={gamePlayers.firstPlayerOrCurrentPlayer?.profileUrl}
                                disablePlayer={(!liveGame || !gamePlayers.firstPlayerOrCurrentPlayer) ? true : (liveGame.currentTurn !== gamePlayers.firstPlayerOrCurrentPlayer.preference)}
                            />
                        </div>
                    </div>

                    {/* ===== Right side (game panel) ===== */}
                    <GamePanel
                        gameStatus={status}
                        messages={chat}
                        onSendMessage={handleSendMessage}
                        onResign={handleResign}
                        onLeave={() => console.log("Leaving game...")}
                        onPlayAgain={() => alert("Rematch request sent!")}
                    />
                </div>
            </main>
        </div>
    );
};

export default GamePage; 