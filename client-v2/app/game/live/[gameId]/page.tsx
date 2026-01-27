"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer } from "lucide-react";
import Link from "next/link";
import MatchResult from "@/components/reusable/MatchResult";
import PlayerBlock from "@/components/reusable/PlayerBlock";
import BoardSquare from "@/components/reusable/BoardSquare";
import { useGameState } from "@/contexts/GameStateContext";
import Loader from "@/components/reusable/Loader";
import { useAppSelector } from "@/redux/store";
import socket from "@/lib/socket/socket";
import { events } from "@/lib/socket/events";
import { AnimatePresence, motion } from "framer-motion";

const GamePage = (): React.ReactElement => {
    // Local states
    const [secondsUntilCancel, setSecondsUntilCancel] = useState<number | null>(null);
    const [displayTimes, setDisplayTimes] = useState({ p1: 0, p2: 0 });

    // Global user id state
    const userId = useAppSelector((state) => state.user.auth.userId)

    // Hooks
    const {
        gameData,
        liveGameData,
        board,
        calculateResult,
        resetBoard,
        newMove,
        gameStatus,
        setGameStatus,
    } = useGameState();

    const result = useMemo(
        () => calculateResult(board), [board, calculateResult]);

    const {
        winner,
        winningCombination
    } = result;

    // Decisive boolean to determine if a game has ended
    const hasGameEnded = ((liveGameData?.winner !== null) || (liveGameData?.moves || []).length === 9);

    // Decisive boolean to determine if  the first move has been played
    const hasFirstMoveBeenPlayed = (liveGameData?.moves || []).length >= 1;

    useEffect(() => {
        if (!liveGameData) return;
        setDisplayTimes({
            p1: liveGameData.players[0].timeLeftMs,
            p2: liveGameData.players[1].timeLeftMs
        });
    }, [liveGameData]); 

    // TICK: A separate effect that just subtracts time from the current state
    useEffect(() => {
        if (!liveGameData || gameStatus !== "active" || !hasFirstMoveBeenPlayed) return;

        const ticker = setInterval(() => {
            setDisplayTimes(prev => {
                const turn = liveGameData.currentTurn;
                const p1 = liveGameData.players[0];

                return {
                    p1: turn === p1.preference ? Math.max(0, prev.p1 - 1000) : prev.p1,
                    p2: turn !== p1.preference ? Math.max(0, prev.p2 - 1000) : prev.p2,
                };
            });
        }, 1000);

        return () => clearInterval(ticker);
    }, [liveGameData?.currentTurn, gameStatus]);


    // Timer Logic for the 20s Grace Period
    useEffect(() => {
        if (!liveGameData || liveGameData.moves.length > 0) {
            setSecondsUntilCancel(null);
            return;
        }

        // Interval
        const interval = setInterval(() => {
            const now = Date.now();
            const created = new Date(liveGameData.createdAt || now).getTime();
            const diff = Math.floor((25000 - (now - created)) / 1000);

            if (diff <= 0) {
                setSecondsUntilCancel(0);
                clearInterval(interval);

                setGameStatus("canceled");
                socket.emit(events.statusUpdate, {
                    gameId: liveGameData._id,
                    status: "canceled"
                });
            } else {
                setSecondsUntilCancel(diff);
            }
        }, 1000);

        // Clean up
        return () => clearInterval(interval);
    }, [liveGameData]);
    return (
        (!gameData || !liveGameData) ? (
            <div className="flex h-screen justify-center items-center">
                <Loader />
            </div>
        ) : (
            <div className="min-h-screen bg-[#F4F4F4] text-zinc-900 font-sans p-4 md:p-8 flex flex-col gap-6">
                {/* ===== 20s initial timer ===== */}
                <AnimatePresence>
                    {secondsUntilCancel !== null && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-125 bg-zinc-900 text-white p-3 flex items-center justify-between border-b-4 border-red-500">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-500 flex items-center justify-center">
                                    <Timer size={18} className="text-white animate-spin-slow" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black leading-none uppercase tracking-widest">Awaiting First Move</p>
                                    <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Match will be discarded shortly</p>
                                </div>
                            </div>
                            <div className="text-2xl font-black font-mono text-red-500">
                                00:{secondsUntilCancel.toString().padStart(2, '0')}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== Match Result Overlay ===== */}
                {gameStatus !== "active" && (<MatchResult
                    setGameStatus={setGameStatus}
                    gameStatus={gameStatus}
                    resetBoard={resetBoard}
                />)}

                {/* ===== Header ===== */}
                <header className="flex items-center justify-start">
                    <Link href="/">
                        <Button variant="outline" className="rounded-none border-2 border-zinc-900 font-black uppercase text-[10px] tracking-widest h-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                            <ArrowLeft size={14} className="mr-2" /> Go back
                        </Button>
                    </Link>
                </header>

                {/* ===== Main ===== */}
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ===== Left Column: Player Entities ===== */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* ===== Player 1 Block ===== */}
                        <PlayerBlock
                            profileUrl={gameData.players[0].profileUrl}
                            isPlayersTurn={liveGameData.currentTurn === gameData.players[0].preference}
                            username={gameData.players[0].username}
                            timeLeftMs={(displayTimes.p1)}
                            currentWinningStreak={gameData.players[0].currentWinStreak}
                            preference={gameData.players[0].preference}
                            hasFirstMoveBeenPlayed={hasFirstMoveBeenPlayed}
                            hasGameEnded={hasGameEnded}
                        />

                        <div className="flex items-center justify-center py-2 italic font-black text-zinc-300 text-xl tracking-[0.5em]">VS</div>

                        {/* ===== Player 2 Block ===== */}
                        <PlayerBlock
                            profileUrl={gameData.players[1].profileUrl}
                            isPlayersTurn={liveGameData.currentTurn === gameData.players[1].preference}
                            username={gameData.players[1].username}
                            timeLeftMs={(displayTimes.p2)}
                            currentWinningStreak={gameData.players[1].currentWinStreak}
                            preference={gameData.players[1].preference}
                            hasFirstMoveBeenPlayed={hasFirstMoveBeenPlayed}
                            hasGameEnded={hasGameEnded}
                        />
                    </div>


                    {/* ===== Center Column: The Board ===== */}

                    <div className="lg:col-span-6 flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-125 bg-white border-4 border-zinc-900 p-1 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)]">

                            {/* The 3x3 Grid */}
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 border-2 border-zinc-900">
                                {/* You'll map through your board state here */}
                                {board.map((value, i) => (
                                    <BoardSquare
                                        key={i}
                                        value={value}
                                        disabled={(
                                            // ==== Disable all squares if it isnt the current users turn to play ==== \\
                                            (liveGameData.players.find((player) => player.userId === userId))?.preference !== liveGameData.currentTurn ||

                                            // Disable a square if there is already a move in it
                                            (board[i] !== null) ||

                                            // Disable all squares if there is a winning combination or a winner
                                            (winner !== null || winningCombination !== null)
                                        )}
                                        isWinningSquare={!winningCombination ? false : (
                                            winningCombination?.some((index) => i === index)
                                        )}
                                        onClick={() => newMove(i, liveGameData.currentTurn, userId)}
                                    />
                                ))}
                            </div>

                            {/* Corner Decorative Elements */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-500" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-zinc-200" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-zinc-200" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-500" />
                        </div>
                    </div>
                </main>

                {/* ===== Footer (action bar) ===== */}
                <footer className="flex justify-center items-center gap-6 mt-4">
                    <Button
                        variant="outline"
                        className="rounded-none h-10 px-6 text-[10px] font-black uppercase tracking-widest border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600"
                    >
                        Forfeit
                    </Button>
                </footer>
            </div>
        )
    );
};

export default GamePage;