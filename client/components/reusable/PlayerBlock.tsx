"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Timer, Trophy } from "lucide-react";
import Link from "next/link";

interface PlayerBlockProps {
    isPlayersTurn: boolean;
    profileUrl: string;
    timeLeftMs: number;
    username: string;
    preference: "X" | "O";
    hasFirstMoveBeenPlayed: boolean;
    currentWinningStreak: number;
    hasGameEnded: boolean;
}

const PlayerBlock = ({
    isPlayersTurn,
    profileUrl,
    timeLeftMs,
    username,
    preference,
    currentWinningStreak,
    hasGameEnded,
    hasFirstMoveBeenPlayed,
}: PlayerBlockProps): React.ReactElement => {

    // Format MS to MM:SS
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeftMs < 10000 && isPlayersTurn;
    return (
        <div className={`relative p-5 border-2 transition-all duration-300 ${(isPlayersTurn && !hasGameEnded && hasFirstMoveBeenPlayed)
            ? 'border-zinc-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 scale-[1.02]'
            : 'border-zinc-200 bg-zinc-100/50 opacity-60 scale-100'
            }`}>
            {/* Turn Indicator Bar */}
            {isPlayersTurn && (
                <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            )}

            <div className="flex gap-4 mb-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={profileUrl} className="object-cover" />
                    <AvatarFallback className="rounded-none bg-zinc-200 font-black text-xs">
                        {username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <Link href={`/profile/${username}`} className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 block hover:text-emerald-500 transition-colors">
                                view profile
                            </Link>
                            <h3 className="font-black text-sm truncate uppercase tracking-tight text-zinc-900">{username}</h3>
                        </div>
                        <div className={`text-2xl font-black italic leading-none ${isPlayersTurn ? 'text-zinc-900' : 'text-zinc-300'}`}>
                            {preference}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Timer Box */}
                <div className={`p-2 flex flex-col items-center justify-center transition-colors ${isUrgent ? 'bg-red-600' : 'bg-zinc-900'
                    }`}>
                    <div className="flex items-center gap-1 mb-1">
                        <Timer size={10} className={isUrgent ? 'text-white' : 'text-emerald-400'} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isUrgent ? 'text-red-100' : 'text-zinc-400'}`}>Time</span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${isUrgent ? 'text-white animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeftMs)}
                    </span>
                </div>

                {/* Streak Box */}
                <div className="border-2 border-zinc-900 p-2 flex flex-col items-center justify-center bg-white">
                    <div className="flex items-center gap-1 mb-1">
                        <Trophy size={10} className="text-amber-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Streak</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-900">
                        {currentWinningStreak} {currentWinningStreak === 1 ? 'Win' : 'Wins'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlayerBlock;