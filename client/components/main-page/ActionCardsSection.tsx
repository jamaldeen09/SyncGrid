"use client"
import React from "react";
import { Badge } from "../ui/badge";
import { GameControllerIcon, LightningIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { ActionCard } from "../reusable/ActionCard";
import { useRouter } from "next/navigation";

const ActionCardsSection = (): React.ReactElement => {
    const router = useRouter();

    const actionCards = [
        {
            id: 1,
            title: "Host Match",
            description: "Configure settings and wait for an opponent or an AI to join your game",
            icon: <GameControllerIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-primary to-primary/70",
            buttonText: "Create",
            funcToExecuteOnButtonClick: () => router.push("/new-game")
        },
        {
            id: 2, // Changed ID for consistency
            title: "Challenge Friend",
            description: "Create a private room and send a direct invite link to a friend to play",
            icon: <UsersThreeIcon weight="fill" className="h-6 w-6" />,
            gradient: "from-indigo-500 to-primary", // Slightly different gradient to distinguish
            buttonText: "Invite",
            funcToExecuteOnButtonClick: () => router.push("/new-game?type=private")
        }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Game Modes</h2>
                <Badge variant="outline" className="gap-2">
                    <LightningIcon weight="fill" />
                    Live
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actionCards.map((actionCard) => (
                    <ActionCard
                        key={actionCard.id}
                        {...actionCard}
                    />
                ))}
            </div>
        </section>
    );
};

export default ActionCardsSection;