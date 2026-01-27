"use client"
import { motion } from "framer-motion";
import { Hash } from "lucide-react";

interface BoardSquareProps {
    value: string | null;
    onClick: () => void;
    disabled: boolean;
    isWinningSquare?: boolean; 
}

const BoardSquare = ({
    value,
    onClick,
    disabled,
    isWinningSquare = false
}: BoardSquareProps) => {
    
    // Logic check: Can the user actually interact with this?
    const isInteractable = !disabled && !value;

    return (
        <button
            onClick={onClick}
            disabled={!isInteractable}
            className={`
                group relative flex items-center justify-center transition-all duration-150
                border border-zinc-100 aspect-square
                ${isWinningSquare ? 'bg-emerald-500 border-emerald-600 z-10' : 'bg-white'}
                ${isInteractable ? 'hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer' : 'cursor-default'}
            `}
        >
            {/* Subtle inner shadow - Only for active squares */}
            {isInteractable && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0px_0px_12px_rgba(0,0,0,0.05)] transition-opacity" />
            )}

            {/* Symbol Rendering */}
            {value && (
                <motion.span
                    initial={{ scale: 0.5, opacity: 0, rotate: value === 'X' ? 10 : -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className={`
                        text-4xl md:text-6xl font-black italic tracking-tighter select-none
                        ${isWinningSquare ? 'text-white' : (value === 'X' ? 'text-zinc-900' : 'text-zinc-400')}
                    `}
                >
                    {value}
                </motion.span>
            )}

            {/* Hover Indicator - Only if empty and game is active */}
            {!value && isInteractable && (
                <div className="opacity-0 group-hover:opacity-10 transition-opacity">
                    <Hash size={32} strokeWidth={3} className="text-zinc-900" />
                </div>
            )}

            {/* Winning Glow Effect */}
            {isWinningSquare && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-white"
                />
            )}
        </button>
    );
};

export default BoardSquare;