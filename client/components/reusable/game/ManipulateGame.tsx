import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UiContextType } from "@/contexts/UiContext";
import { CircleIcon, GameControllerIcon, TimerIcon, XIcon } from "@phosphor-icons/react";
import { MinimalGameData } from "@shared/index";
import React, { useState } from "react";


interface GameManipulationProps {
    manipulationType: "create" | "update";
    closeUi: UiContextType["closeUi"];
    currentGameState: MinimalGameData;
};

const GameManipulation = ({
    closeUi,
    manipulationType,
    currentGameState
}: GameManipulationProps): React.ReactElement => {
    // States
    const [gameData, setGameData] = useState<MinimalGameData>({
        timeSettingMs: (manipulationType === "create" ? 120000 : currentGameState.timeSettingMs),
        preference: (manipulationType === "create" ? "X" : currentGameState.preference),
    });

    // Time options
    const timeOptions = [
        {
            value: 30000,
            label: "Bullet",
            description: "30 seconds",
        },
        {
            value: 60000,
            label: "Blitz",
            description: "1 minute",
        },
        {
            value: 120000,
            label: "Rapid",
            description: "2 minutes",
        },
    ];

    // Get time summary
    const getTimeSummary = () => {
        const selectedTimeOption = timeOptions.find((option) => option.value === gameData.timeSettingMs);
        if (!selectedTimeOption) return "Rapid (2 minutes Per Side)";

        return `${selectedTimeOption.label} (${selectedTimeOption.description} Per Side)`
    }
    return (
        <div className="space-y-6 p-2">

            {/* ===== Header ===== */}
            <header className="sm:text-center sm:block flex items-center justify-between">
                <div className="">
                    <h2 className="text-xl font-bold">Create New Game </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Modify your tic tac toe match
                    </p>
                </div>

                {/* X/Cancel button */}
                <Button
                    onClick={() => closeUi("createGame")}
                    size="icon-lg"
                    variant="outline"
                    className="sm:hidden"
                >
                    <XIcon />
                </Button>
            </header>

            {/* ===== Validation errors ===== */}
            {/* {validationErrors.length > 0 && (
                <div className="overflow-hidden my-4">
                    <div className="flex flex-col bg-destructive/10 border border-destructive h-40 overflow-y-auto p-2 gap-2 element-scrollable-hidden-scrollbar">
                        <p className="text-xs text-destructive border-b border-destructive pb-1.5">Validation errors</p>
                        <div className="flex flex-col gap-2 text-destructive px-4">
                            {validationErrors.map((error, i) => {
                                return (
                                    <li key={i}>{error.field} - {error.message}</li>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )} */}

            {/* ===== Time Settings ===== */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <TimerIcon size={14} className="text-primary" />
                        Time Control
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {timeOptions.map((option) => {
                        const isActive = gameData.timeSettingMs === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setGameData((prevState) => ({
                                    ...prevState,
                                    timeSettingMs: option.value,
                                }))}
                                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 group
                                    ${isActive
                                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-[0_0_15px_-5px_rgba(var(--primary),0.4)]"
                                        : "border-border hover:border-primary/50 bg-card"}`}
                            >
                                <div className={`${isActive ? "text-primary" : "text-muted-foreground"} transition-colors`}>
                                    <TimerIcon weight="fill" className="h-5 w-5" />
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold">{option.label}</div>
                                    <div className="text-[10px] font-medium opacity-60">{option.description}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>


            {/* ===== Preference Selection ===== */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground px-1">
                    Preference
                </h3>
                <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1.5 rounded-xl border">
                    <button
                        onClick={() => setGameData((prevState) => ({
                            ...prevState,
                            preference: "X",
                        }))}
                        className={`flex items-center justify-center gap-3 py-3 rounded-lg transition-all
                        ${gameData.preference === "X" ? "bg-background shadow-sm border border-border" : "opacity-50 hover:opacity-80"}`}
                    >
                        <XIcon size={20} weight="bold" className="text-red-500" />
                        <span className="text-xs font-bold">Player X</span>
                    </button>
                    <button
                        onClick={() => setGameData((prevState) => ({
                            ...prevState,
                            preference: "O",
                        }))}
                        className={`flex items-center justify-center gap-3 py-3 rounded-lg transition-all
                        ${gameData.preference === "O" ? "bg-background shadow-sm border border-border" : "opacity-50 hover:opacity-80"}`}
                    >
                        <CircleIcon size={20} weight="bold" className="text-blue-500" />
                        <span className="text-xs font-bold">Player O</span>
                    </button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground">
                    Note: Player X always moves first
                </p>
            </section>


            {/* ===== Summary Card ===== */}
            <div className="relative overflow-hidden rounded-xl border bg-linear-to-b from-muted/50 to-muted/20 p-4">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <GameControllerIcon size={80} weight="fill" />
                </div>

                <h3 className="text-[10px] font-black text-primary mb-3">Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground">Timer</span>
                        <span className="text-xs font-bold">
                            {getTimeSummary()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground">Preference</span>
                        <Badge variant="outline" className="text-[10px] font-bold bg-background border-red-500/20 text-red-500">
                            Play as {gameData.preference}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    onClick={() => closeUi(manipulationType === "update" ? "createGame" : "createGame")}
                    variant="outline"
                    className="flex-1 gap-2"
                >
                    <XIcon className="h-4 w-4" />
                    Cancel
                </Button>

                <Button
                    className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/70"
                >
                    Create game
                </Button>
            </div>
        </div>
    );
};
export default GameManipulation;