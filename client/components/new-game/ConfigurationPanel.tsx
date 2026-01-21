"use client"
import React from "react";
import { CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { UserIcon, GameControllerIcon, CircleIcon, XIcon, PlusIcon } from "@phosphor-icons/react";
import { MinimalGameSettings } from "@shared/index";
import { UiContextType, useUi } from "@/contexts/UiContext";
import socket from "@/lib/socket/socket";
import { callToast } from "@/providers/SonnerProvider";
import { events } from "@/lib/socket/events";
import { useAppSelector } from "@/redux/store";
import { ListenerCallbackArgs } from "@shared/index"


const ConfigurationPanel = ({
    gameData,
    setGameData,
    ui,
    openUi,
}: {
    ui: UiContextType["ui"];
    openUi: UiContextType["openUi"];
    gameData: MinimalGameSettings;
    setGameData: React.Dispatch<React.SetStateAction<MinimalGameSettings>>;
}): React.ReactElement => {
    // userId
    const userId = useAppSelector((state) => state.user.auth.userId)

    // Used to find an opponent
    const findOpponent = () => {
        // ===== Prevent offline users from trying to find an opponent ===== \\
        if (!socket.connected)
            return callToast("error", "You are currently offline");

        openUi("searchingForOpponent")
        socket.emit(events.findOpponent, {
            userId,
            preference: gameData.preference
        }, (response: ListenerCallbackArgs<void>) => {
            if (!response.success) {
                callToast(
                    "error",
                    response.message,
                )
            }
        });
    }
    return (
        <div className="w-full mx-auto max-w-175 lg:mx-0 lg:max-w-lg bg-linear-to-b from-card via-card/95 to-card/90 backdrop-blur-sm border border-border/40 shadow-2xl p-6 flex flex-col gap-6">
            {/* ===== Header ===== */}
            <header className="space-y-2 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary">
                        <PlusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Create Match
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Choose what you would like to play as</p>
                    </div>
                </div>
            </header>

            {/* ===== Main Configuration ===== */}
            <main className="flex flex-col gap-5">

                {/* Play As Select */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <GameControllerIcon className="h-4 w-4 text-primary" />
                        <span>Play As</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {/* X Option */}
                        <button
                            onClick={() => setGameData(prev => ({ ...prev, preference: "X" }))}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 group
                ${gameData.preference === "X"
                                    ? "border-primary bg-primary/10 ring-2 ring-primary/50 shadow-[0_0_20px_-8px_rgba(var(--primary),0.4)]"
                                    : "border-border/50 hover:border-primary/50 bg-card hover:bg-primary/5"}`}
                        >
                            <div className={`${gameData.preference === "X"
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-primary/80"} transition-colors`}>
                                <XIcon weight="bold" className="h-7 w-7" />
                            </div>
                            <div className="text-center space-y-0.5">
                                <div className="text-sm font-bold">Player X</div>
                                <div className="text-xs text-muted-foreground font-medium">First move</div>
                            </div>
                            {gameData.preference === "X" && (
                                <div className="absolute -top-1.5 -right-1.5">
                                    <div className="bg-linear-to-br from-primary to-primary/80 text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                        ✓
                                    </div>
                                </div>
                            )}
                        </button>

                        {/* O Option */}
                        <button
                            onClick={() => setGameData(prev => ({ ...prev, preference: "O" }))}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 group
                ${gameData.preference === "O"
                                    ? "border-foreground/50 bg-foreground/10 ring-2 ring-foreground/50 shadow-[0_0_20px_-8px_rgba(255,255,255,0.2)]"
                                    : "border-border/50 hover:border-foreground/50 bg-card hover:bg-foreground/5"}`}
                        >
                            <div className={`${gameData.preference === "O"
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:text-foreground/80"} transition-colors`}>
                                <CircleIcon weight="bold" className="h-7 w-7" />
                            </div>
                            <div className="text-center space-y-0.5">
                                <div className="text-sm font-bold">Player O</div>
                                <div className="text-xs text-muted-foreground font-medium">Second move</div>
                            </div>
                            {gameData.preference === "O" && (
                                <div className="absolute -top-1.5 -right-1.5">
                                    <div className="bg-linear-to-br from-foreground to-foreground/80 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                        ✓
                                    </div>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Action Button */}
                <Button
                    onClick={findOpponent}
                    disabled={ui.searchingForOpponent}
                    className="h-14 mt-2 bg-linear-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
                >
                    {ui.searchingForOpponent ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Searching opponent...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <span>Start game</span>
                        </div>
                    )}
                </Button>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                    <div className="text-center">
                        <div className="text-lg font-bold text-primary">48k</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Online</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold">10s</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Wait</div>
                    </div>
                </div>

                {/* Alternative Action */}
                <div className="space-y-2 pt-2">
                    <Button
                        disabled={ui.searchingForOpponent}
                        variant="outline"
                        className="h-12 w-full hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <UserIcon className="h-4 w-4" />
                            <span>Challenge a Friend</span>
                        </div>
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default ConfigurationPanel;