"use client"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    RobotIcon,
    LightningIcon,
    ChartLineIcon,
    TrophyIcon,
    UserCircleIcon,
    FireIcon,
    UsersIcon,
    GameControllerIcon,
    UsersThreeIcon,
    MagnifyingGlassIcon
} from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { ActionCard } from "@/components/reusable/ActionCard";
import { PublicGameCard, PublicGameCardProps } from "@/components/reusable/PublicGameCard";
import Navbar from "@/components/main-page/Navbar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useUi } from "@/contexts/UiContext";


const MainPage = (): React.ReactElement => {
    const dispatch = useAppDispatch();
    const { openUi } = useUi();

    // Action cards
    const actionCards = [
        {
            id: 1,
            title: "Create a Game",
            description: "Start a new public or private match",
            icon: <GameControllerIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-primary to-primary/70",
            buttonText: "Create",
            funcToExecuteOnButtonClick: () => {
                openUi("gameCreation")
            }
        },
        {
            id: 2,
            title: "Challenge a Friend",
            description: "Invite someone with a private link",
            icon: <UsersIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-green-500 to-emerald-600",
            buttonText: "Invite",
            funcToExecuteOnButtonClick: () => ""
        },
        {
            id: 3,
            title: "Play vs Computer",
            description: "Play offline against AI",
            icon: <RobotIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-purple-500 to-purple-600",
            buttonText: "Start",
            funcToExecuteOnButtonClick: () => { },
        },

        {
            id: 4,
            title: "Find a public game",
            description: "Quickly find someone to play against",
            icon: <MagnifyingGlassIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-amber-500 to-orange-600",
            buttonText: "Find",
            funcToExecuteOnButtonClick: () => openUi("playAsClarification")
        }
    ];
    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground">
                {/* ===== Navbar ===== */}
                <Navbar />

                {/* ===== Main content ===== */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                    {/* ===== Hero section ===== */}
                    <section className="text-center space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                            Play <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tic-Tac-Toe</span> in Real-Time
                        </h1>
                        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Challenge friends, join public matches, or practice against AI — all in a sleek, modern interface.
                        </p>
                    </section>

                    {/* ===== Action cards ===== */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Quick Actions</h2>
                            <Badge variant="outline" className="gap-2">
                                <LightningIcon weight="fill" className="h-3 w-3" />
                                <span>Live</span>
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {actionCards.map((actionCard) => (<ActionCard key={actionCard.id} {...actionCard} />))}
                        </div>
                    </section>

                    {/* ===== Public games ===== */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">Live Public Games</h2>
                                <p className="text-sm text-muted-foreground">Join ongoing matches in real-time</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                // Add your onClick handler here for leaderboard modal/page
                                >
                                    <UsersThreeIcon className="h-4 w-4" />
                                    <span>Top Players</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {([
                                { players: ["Alice (X)", "Bob (O)"], status: "playing", moves: 4 },
                                { players: ["Charlie", "David"], status: "waiting", moves: 0 },
                                { players: ["Eve", "Frank"], status: "playing", moves: 6 },
                                { players: ["Grace", "Henry"], status: "finished", moves: 9 },
                                { players: ["Ivy", "Jack"], status: "playing", moves: 3 },
                                { players: ["Kara", "Leo"], status: "waiting", moves: 0 },
                                { players: ["Mia", "Noah"], status: "playing", moves: 7 },
                                { players: ["Olivia", "Paul"], status: "playing", moves: 2 },
                            ] as (Omit<PublicGameCardProps["game"], "players"> & { players: [string, string] })[]).map((game, i) => (
                                <PublicGameCard key={i} game={game} index={i} />
                            ))}
                        </div>


                        {/* See more */}
                        <div className="w-full flex justify-center items-center mt-10">
                            <Button variant="outline">See more</Button>
                        </div>
                    </section>

                    {/* STATS SECTION */}
                    <section className="bg-linear-to-r from-muted/30 to-muted/10 rounded-2xl p-6 border border-border/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <UserCircleIcon className="h-5 w-5 text-primary" weight="fill" />
                                    <div className="text-3xl font-bold text-primary">24</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Active Players</div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <FireIcon className="h-5 w-5 text-primary" weight="fill" />
                                    <div className="text-3xl font-bold text-primary">12</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Live Games</div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <ChartLineIcon className="h-5 w-5 text-primary" weight="fill" />
                                    <div className="text-3xl font-bold text-primary">156</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Games Today</div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <TrophyIcon className="h-5 w-5 text-primary" weight="fill" />
                                    <div className="text-3xl font-bold text-primary">98%</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </section>
                </main>
            </div></>
    );
};

export default MainPage;


