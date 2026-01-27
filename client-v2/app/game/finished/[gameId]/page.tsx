"use client"
import React, { useEffect, useState, useCallback } from "react";
import { History, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlayerBlock from "@/components/reusable/PlayerBlock";
import { useGameState } from "@/contexts/GameStateContext";
import BoardSquare from "@/components/reusable/BoardSquare";
import { useRouter } from "next/navigation";
import Loader from "@/components/reusable/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FinishedGamePage = (): React.ReactElement => {

    // Local states
    const [activeMoves, setActiveMoves] = useState<Set<number>>(new Set());

    // App router
    const router = useRouter();

    const {
        gameData,
        board,
        resetBoard,
        fillBoard,
    } = useGameState();

    // Logic to translate index to human coordinates
    const getCoords = (i: number) => ({
        row: Math.floor(i / 3) + 1,
        col: (i % 3) + 1
    });

    const addOrRemoveAnActiveMove = useCallback((index: number) => {
        // Delete the board location if its already active
        setActiveMoves((prevState) => {
            const newSet = new Set(prevState);
            if (newSet.has(index)) newSet.delete(index)
            else newSet.add(index)

            return newSet
        })
    }, [activeMoves]);

    const getWhoPlayedAMove = useCallback((playedBy: string) => {
        if (!gameData) return;
        const player = gameData.players.find((player) => player.userId === playedBy);
        if (!player) return;
        return player.profileUrl
    }, [gameData]);

    // Fill up the board when this component mounts
    useEffect(() => {
        if (!gameData) return;
        const moves = gameData.moves.map((move) => ({
            value: move.value,
            boardLocation: move.boardLocation,
        }));

        const boardLocations = gameData.moves.map((move) => move.boardLocation);

        fillBoard(moves);
        setActiveMoves(new Set(boardLocations));
    }, [gameData, fillBoard]);

    // Re fill the board anytime an active move 
    // is added or removed
    useEffect(() => {
        if (!gameData) return;
        const moves = gameData.moves.filter((move) => activeMoves.has(move.boardLocation));

        resetBoard()
        fillBoard(moves.map((move) => ({
            value: move.value,
            boardLocation: move.boardLocation,
        })));
    }, [activeMoves, gameData, resetBoard, fillBoard]);


    return (
        !gameData ? (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        ) : (
            <div className="min-h-screen bg-[#F4F4F4] text-zinc-900 font-sans p-4 md:p-8 flex flex-col gap-6">

                {/* Header: Match Identity */}
                <header className="flex items-center justify-start">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="rounded-none border-2 border-zinc-900 font-black uppercase text-[10px] tracking-widest h-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <ArrowLeft size={14} className="mr-2" /> Go back
                    </Button>
                </header>

                <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* COLUMN 1: PLAYERS (3/12) */}
                    <aside className="lg:col-span-3 space-y-6">
                        <PlayerBlock
                            profileUrl={gameData.players[0].profileUrl}
                            isPlayersTurn={false}
                            username={gameData.players[0].username}
                            timeLeftMs={0}
                            currentWinningStreak={gameData.players[0].currentWinStreak}
                            preference={gameData.players[0].preference}
                            hasFirstMoveBeenPlayed
                            hasGameEnded
                        />
                        <div className="flex items-center justify-center py-2 italic font-black text-zinc-300 text-xl tracking-[0.5em]">VS</div>
                        <PlayerBlock
                            profileUrl={gameData.players[1].profileUrl}
                            isPlayersTurn={false}
                            username={gameData.players[1].username}
                            timeLeftMs={0}
                            currentWinningStreak={gameData.players[1].currentWinStreak}
                            preference={gameData.players[1].preference}
                            hasFirstMoveBeenPlayed
                            hasGameEnded
                        />
                    </aside>

                    {/* COLUMN 2: THE BOARD (6/12) */}
                    <section className="lg:col-span-6 flex flex-col items-center justify-center gap-8">
                        <div className="relative w-full aspect-square max-w-125 bg-white border-[6px] border-zinc-900 p-1 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.08)]">
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 bg-zinc-900 gap-1 border-2 border-zinc-900">
                                {board.map((val, i) => (
                                    <BoardSquare
                                        key={i}
                                        value={val}
                                        onClick={() => { }}
                                        disabled={false}
                                        isWinningSquare={false}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* COLUMN 3: MOVE HISTORY (3/12) */}
                    <aside className="lg:col-span-3 flex flex-col h-full">
                        <div className="bg-zinc-900 text-white p-4 border-b-4 border-emerald-500">
                            <div className="flex items-center gap-2">
                                <History size={16} className="text-emerald-500" />
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Move Log</h3>
                            </div>
                        </div>

                        <div
                            className="flex-1 bg-white border-x-2 border-b-4 border-zinc-900 overflow-y-auto max-h-100 lg:max-h-125 element-scrollable-hidden-scrollbar"
                        >
                            {gameData.moves.length === 0 ? (
                                <div className="p-12 text-center text-zinc-300 font-black uppercase italic text-xs">No moves recorded</div>
                            ) : (
                                <div className="divide-y-2 divide-zinc-100">
                                    {gameData.moves.map((move, idx) => (
                                        <div
                                            onClick={() => addOrRemoveAnActiveMove(move.boardLocation)}
                                            key={idx}
                                            className={`p-4 flex items-center justify-between transition-colors group cursor-default
                                        ${activeMoves.has(move.boardLocation) ? "bg-emerald-50/50 hover:bg-emerald-50/90" : "hover:bg-emerald-50/50"}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-mono text-zinc-300">#{idx + 1}</span>
                                                <div className={`w-8 h-8 flex items-center justify-center font-black text-sm border-2 ${move.value === 'X' ? 'border-emerald-500 text-emerald-600' : 'border-zinc-900 text-zinc-900'}`}>
                                                    {move.value}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-tighter">Square {move.boardLocation}</p>
                                                    <p className="text-[8px] text-zinc-400 font-bold uppercase">Row {getCoords(move.boardLocation).row} • Col {getCoords(move.boardLocation).col}</p>
                                                </div>
                                            </div>

                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={getWhoPlayedAMove(move.playedBy)} className="object-cover" />
                                                <AvatarFallback className="rounded-none bg-zinc-200 font-black text-xs">
                                                    SG
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>
                </main>
            </div>
        )
    );
};

export default FinishedGamePage