"use client"
import React, { useEffect, useState } from "react";
import { Square } from "@/components/reusable/game/Square";
import Navbar from "@/components/main-page/Navbar";
import Player from "@/components/reusable/game/Player";
import { useAppSelector } from "@/redux/store";
import ConfigurationPanel from "@/components/new-game/ConfigurationPanel";
import { MinimalGameSettings } from "@shared/index";
import { useUi } from "@/contexts/UiContext";

const NewGamePage = (): React.ReactElement => {
    // Local states
    const [gameData, setGameData] = useState<MinimalGameSettings>({ preference: "X" });
    const [randomImageUrl, setRandomImageUrl] = useState<string | undefined>();

    // Hooks
    const {
        username,
        profileUrl,
        currentWinStreak
    } = useAppSelector((state) => state.user.profile);

    const { ui, openUi } = useUi();

    // Fake game state for the preview board
    const previewBoard: ("X" | "O" | number)[] = [
        "X", 2, "O",
        4, "X", 6,
        "O", 8, "X"
    ];

    // Images that flash in the opponent's area to indicate
    // we are searching for an opponent
    const findingOpponentImageUrls = [
        "https://github.com/shadcn.png",
        "https://github.com/evilrabbit.png",
        "https://github.com/maxleiter.png",
    ];

    useEffect(() => {
        if (!ui.searchingForOpponent) return;

        const timerId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * findingOpponentImageUrls.length - 1);
            setRandomImageUrl(findingOpponentImageUrls[randomIndex]);
        }, 200);

        return () => clearInterval(timerId);
    }, [ui.searchingForOpponent]);
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
                                username="opponent"
                                preference={gameData.preference === "X" ? "O" : "X"}
                                profileUrl={randomImageUrl}
                            />

                            {/* ===== Center (actual board) ===== */}
                            <div className="w-full aspect-square shadow-2xl shadow-primary/5">
                                <div className="grid grid-cols-3 w-full h-full border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
                                    {previewBoard.map((value, i) => (
                                        <Square
                                            key={i}
                                            value={value}
                                            onClick={() => { }}
                                            disableSquare
                                            className="w-full! h-full!"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Current player */}
                            <Player
                                username={username}
                                preference={gameData.preference}
                                currentWinStreak={currentWinStreak}
                                profileUrl={profileUrl}
                            />
                        </div>
                    </div>

                    {/* ===== Right side (configuration panel) ===== */}
                    <ConfigurationPanel
                        gameData={gameData}
                        setGameData={setGameData}
                        ui={ui}
                        openUi={openUi}
                    />
                </div>
            </main>
        </div>
    );
};

export default NewGamePage;
