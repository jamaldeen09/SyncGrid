"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ResultStatus = "won" | "lost" | "draw" | "canceled" | "active";

interface MatchResultProps {
    gameStatus: ResultStatus;
    setGameStatus: React.Dispatch<React.SetStateAction<ResultStatus>>
    onClose?: () => void;
    resetBoard: () => void;
}

const MatchResult = ({ gameStatus, onClose, setGameStatus, resetBoard }: MatchResultProps) => {
    const [showActions, setShowActions] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (gameStatus !== "active") {
            // Sound trigger (optional)
            // const audio = new Audio(`/sounds/${gameStatus}.mp3`);
            // audio.volume = 0.3;
            // audio.play().catch(() => {});

            const timer = setTimeout(() => setShowActions(true), 2000);
            return () => clearTimeout(timer);
        }
        setShowActions(false);
    }, [gameStatus]);

    const config = {
        won: { title: "Victory_", color: "text-emerald-500", bar: "bg-emerald-500", sub: "You Won // Match Over" },
        lost: { title: "Defeat_", color: "text-red-600", bar: "bg-red-500", sub: "You Lost // Match Over" },
        draw: { title: "Draw_", color: "text-zinc-900", bar: "bg-zinc-900", sub: "It's a tie // Match Over" },
        canceled: { title: "Aborted_", color: "text-amber-500", bar: "bg-amber-500", sub: "Inactivity // Match Canceled" },
    }[gameStatus as Exclude<ResultStatus, "active">];

    if (gameStatus === "active") return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
            >
                {/* Background Dimmer */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />

                {/* Main Container */}
                <div className="relative flex flex-col items-center w-full max-w-4xl px-4">

                    {/* Top Decorative Bar */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className={`h-1.5 mb-6 ${config.bar} animate-pulse`}
                    />

                    {/* Massive Header */}
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className={`text-7xl md:text-[12rem] font-black italic tracking-tighter uppercase leading-none select-none ${config.color}`}
                        style={{ textShadow: "12px 12px 0px rgba(0,0,0,0.05)" }}
                    >
                        {config.title}
                    </motion.h1>

                    {/* Sub-text Strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 px-8 py-3 bg-zinc-900 text-white font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase flex items-center"
                    >
                        {config.sub}
                        <span className="animate-ping ml-2 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>

                    {/* ACTION AREA */}
                    <div className="mt-12 w-full max-w-sm h-24 flex flex-col items-center">
                        {!showActions ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full space-y-2"
                            >
                                <div className="h-1 w-full bg-zinc-100 border border-zinc-200">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        className={`h-full ${config.bar}`}
                                    />
                                </div>
                                <p className="text-center font-black text-[9px] uppercase tracking-widest text-zinc-400">
                                    Finalizing Results...
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 gap-4 w-full pointer-events-auto"
                            >
                                <Button
                                    onClick={() => {
                                        resetBoard();
                                        router.push("/");

                                        setTimeout(() => setGameStatus("active"), 200);
                                    }}
                                    variant="outline"
                                    className="w-full rounded-none border-4 border-zinc-900 font-black uppercase text-xs h-14 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                                    <Home size={16} className="mr-2" /> Exit
                                </Button>
                                <Button
                                    onClick={onClose}
                                    className="w-full rounded-none bg-zinc-900 text-white border-4 border-zinc-900 font-black uppercase text-xs h-14 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:bg-zinc-800 transition-all active:translate-x-0.5 active:translate-y-0.5"
                                >
                                    Board <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Decorative Bar */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className={`h-1.5 mt-6 ${config.bar} animate-pulse`}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MatchResult;