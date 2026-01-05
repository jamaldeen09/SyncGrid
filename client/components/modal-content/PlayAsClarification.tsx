import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon, CircleIcon, CheckIcon, QuestionIcon } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import socket from "@/lib/socket";
import { callToast } from "@/providers/SonnerProvider";
import { Spinner } from "../ui/spinner";
import { SocketResponse } from "@/lib/types";

type PlayAsPreference = "X" | "O" | "any";

const PlayAsClarification = (): React.ReactElement => {
    const [selectedPreference, setSelectedPreference] = useState<PlayAsPreference | null>(null);
    const dispatch = useAppDispatch();
    const { findingGame } = useAppSelector((state) => state.triggers.booleanTriggers)
    const setIsFindingGame = (value: boolean) => dispatch(setBooleanTrigger({ key: "findingGame", value }))

    // Options
    const options = [
        {
            value: "X" as const,
            label: "Play as X",
            description: "Make the first move",
            icon: <XIcon weight="bold" className="h-8 w-8" />,
            color: "bg-red-500/10 text-red-600 border-red-500/20",
            badgeColor: "bg-red-500 text-white",
        },
        {
            value: "O" as const,
            label: "Play as O",
            description: "Play as second player",
            icon: <CircleIcon weight="bold" className="h-8 w-8" />,
            color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            badgeColor: "bg-blue-500 text-white",
        },
        {
            value: "any" as const,
            label: "Any role",
            description: "Play as X or O",
            icon: <QuestionIcon weight="bold" className="h-8 w-8" />,
            color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            badgeColor: "bg-purple-500 text-white",
        },
    ];

    //   Disables the modal this component is rendered on
    const disableModal = () => dispatch(setBooleanTrigger({ key: "playAsClarification", value: false }))

    const handleFindMatch = () => {
        // Handles cases whereby a user manages to click this button before a socket connection is established
        if (!socket.connected) {
            callToast("error", "Connection has not been established, Please try again shortly");
            return;
        }

        // Handles cases with no selected preference
        if (!selectedPreference) {
            callToast("error", "Please select what you would like to play as");
            return;
        }

        setIsFindingGame(true);

        // Emit an event via web socket 
        socket.emit("find_game", {
            userId: crypto.randomUUID(),
            playAsPreference: selectedPreference,
        }, (response: SocketResponse) => {
            const typedData = response.data as { gameId: string };
            setIsFindingGame(false);

            if (!response.success) {
                callToast("error", response.message);
                return;
            }

            socket.emit("join_game_room", { gameId: typedData.gameId, matchmaking: true });
        });
    };
    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="sm:text-center sm:block flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Find a Match</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Choose your preferred role to start searching
                    </p>
                </div>

                <Button variant="outline" size="icon-lg" onClick={disableModal} className="sm:hidden">
                    <XIcon />
                </Button>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 gap-4">
                {options.map((option) => (
                    <Card
                        key={option.value}
                        className={`p-4 cursor-pointer transition-all border ${findingGame && "opacity-70 pointer-events-none cursor-default"} ${selectedPreference === option.value
                            ? `${option.color} ring-2 ring-offset-2 ring-offset-background ${option.value === "X"
                                ? "ring-red-500"
                                : option.value === "O"
                                    ? "ring-blue-500"
                                    : "ring-purple-500"
                            }`
                            : "border-border hover:border-primary/30"
                            }`}
                        onClick={() => {
                            if (findingGame) return;
                            return setSelectedPreference(option.value);
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg`}>
                                    {option.icon}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{option.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {option.description}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedPreference === option.value && (
                                    <CheckIcon className="h-5 w-5 text-primary" weight="bold" />
                                )}
                                <Badge
                                    variant="outline"
                                    className={`${option.badgeColor} w-fit h-fit`}
                                >
                                    {option.value === "any" ? "Flexible" : option.value}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Selection Info */}
            {selectedPreference && (
                <Card className="p-4 bg-muted/30">
                    <div className="text-sm">
                        <div className="font-medium mb-1">Matchmaking with:</div>
                        <div className="flex items-center gap-2">
                            {selectedPreference === "X" ? (
                                <>
                                    <XIcon className="h-4 w-4 text-red-500" />
                                    <span>Games needing <strong>Player X</strong></span>
                                </>
                            ) : selectedPreference === "O" ? (
                                <>
                                    <CircleIcon className="h-4 w-4 text-blue-500" />
                                    <span>Games needing <strong>Player O</strong></span>
                                </>
                            ) : (
                                <>
                                    <QuestionIcon className="h-4 w-4 text-purple-500" />
                                    <span>Any available game</span>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Action Button */}
            <div className="pt-2">
                <Button
                    onClick={handleFindMatch}
                    disabled={!selectedPreference || findingGame}
                    className="w-full gap-2 bg-linear-to-r from-primary to-primary/70"
                    size="lg"
                >
                    {findingGame ? (
                        <>
                            <Spinner />
                            Searching for a match...
                        </>
                    ) : (
                        <>
                            Find Match
                        </>
                    )}
                </Button>

                {findingGame && (
                    <Button 
                      onClick={() => setIsFindingGame(false)} 
                      variant="destructive" 
                      size="lg" 
                      className="w-full mt-3"
                    >
                        Stop
                    </Button>
                )}

                <p className="text-xs text-center text-muted-foreground mt-3">
                    {!selectedPreference
                        ? "Select a role above to continue"
                        : "Click to start searching for opponents"}
                </p>
            </div>
        </div>
    );
};

export default PlayAsClarification;