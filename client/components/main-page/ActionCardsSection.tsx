"use client"
import React from "react";
import { Badge } from "../ui/badge";
import { GameControllerIcon, LightningIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useUi } from "@/contexts/UiContext";
import { ActionCard } from "../reusable/ActionCard";

const ActionCardsSection = (): React.ReactElement => {
    // Hooks
    const { openUi } = useUi()

    // ===== Action cards ===== \\
    const actionCards = [
        {
            id: 1,
            title: "Host Match",
            description: "Configure your own game settings and wait for an opponent to join your game",
            icon: <GameControllerIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-primary to-primary/70",
            buttonText: "Create",
            funcToExecuteOnButtonClick: () => openUi("createGame")
        },
        {
            id: 4,
            title: "Quick Match",
            description: "Skip the setup and jump into the first available public game in the queue",
            icon: <MagnifyingGlassIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-primary to-primary/70",
            buttonText: "Join",
            funcToExecuteOnButtonClick: () => { }
        }
    ];
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
                <Badge variant="outline" className="gap-2">
                    <LightningIcon weight="fill" />
                    Live
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {actionCards.map((actionCard) => (
                    <ActionCard
                        key={actionCard.id}
                        {...actionCard}
                    />
                )
                )}
            </div>
        </section>
    );
};

export default ActionCardsSection;