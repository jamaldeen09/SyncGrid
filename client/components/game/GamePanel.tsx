"use client"
import React, { useState } from "react";
import {
    PaperPlaneTilt,
    Flag,
    ArrowsClockwise,
    SignOut,
    ChatTeardropDots
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button"; // Adjust path to your shadcn components
import { Input } from "@/components/ui/input";   // Optional: using shadcn input for consistency

interface GamePanelProps {
    gameStatus: "active" | "finished";
    messages: { sender: string; text: string }[];
    onSendMessage: (msg: string) => void;
    onResign: () => void;
    onLeave: () => void;
    onPlayAgain: () => void;
}

const GamePanel = ({
    gameStatus = "active",
    messages = [],
    onSendMessage,
    onResign,
    onLeave,
    onPlayAgain
}: GamePanelProps): React.ReactElement => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="w-full mx-auto max-w-175 lg:mx-0 lg:max-w-lg bg-linear-to-b from-card via-card/95 to-card/90 backdrop-blur-sm border border-border/40 shadow-2xl p-6 flex flex-col gap-6">

            {/* ===== Chat Header ===== */}
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <ChatTeardropDots size={20} className="text-primary" weight="fill" />
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Chat</h3>
            </div>

            {/* ===== Message Display Area ===== */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground/50 text-sm italic">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-muted-foreground mb-1 px-1">{msg.sender}</span>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'You'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted text-foreground rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ===== Input & Actions Section ===== */}
            <div className="flex flex-col gap-4 pt-2">

                {/* Chat Input */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="w-full bg-background/50 border border-border/60 rounded-lg py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSend}
                        className="absolute right-1 text-primary hover:text-primary hover:bg-transparent"
                    >
                        <PaperPlaneTilt size={22} weight="fill" />
                    </Button>
                </div>

                {/* Dynamic Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {gameStatus === "active" ? (
                        <Button
                            variant="destructive"
                            className="col-span-2 w-full flex gap-2 h-11"
                            onClick={onResign}
                        >
                            <Flag size={18} weight="fill" />
                            Resign
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="default"
                                className="w-full flex gap-2 h-11"
                                onClick={onPlayAgain}
                            >
                                <ArrowsClockwise size={18} weight="bold" />
                                Play Again
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full flex gap-2 h-11 bg-transparent"
                                onClick={onLeave}
                            >
                                <SignOut size={18} weight="fill" />
                                Leave
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePanel;