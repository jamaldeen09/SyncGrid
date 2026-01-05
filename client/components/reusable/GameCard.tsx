import {
    GameControllerIcon,
    LightningIcon,
    CheckCircleIcon,
    HourglassIcon,
    QuestionMarkIcon,
    TrashIcon,
    GearIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    EyeIcon,
} from "@phosphor-icons/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {Game } from "@/lib/types";
import CustomAvatar from "./CustomAvatar";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react/dist/ssr";
import { JSX } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const GameCardSkeleton = () => {
    return (
        <Card className="group relative overflow-hidden border-border/40">
            <div className="p-4 space-y-4">
                {/* ===== Game Header Skeleton ===== */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                    <Skeleton className="w-20 h-6 rounded-full" />
                </div>

                {/* ===== Game Info Skeleton ===== */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>

                {/* ===== Action Buttons Skeleton ===== */}
                <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                </div>

                {/* ===== Main Action Button Skeleton ===== */}
                <Skeleton className="w-full h-9 rounded-md" />
            </div>
        </Card>
    )
}

export const GameCard = ({ game }: {
    game: Game;
}) => {
    const statusColors: Record<Game["game_settings"]["status"], string> = {
        "matched": "bg-green-500/20 text-green-500 border-green-500/30",
        "in_queue": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        "finished": "bg-muted text-muted-foreground border-muted",
        "created": "bg-muted text-muted-foreground border-muted"
    };

    const statusIcons: Record<Game["game_settings"]["status"], JSX.Element> = {
        "matched": <LightningIcon weight="fill" className="h-3 w-3 mr-1" />,
        "in_queue": <HourglassIcon className="h-3 w-3 mr-1" />,
        "finished": <CheckCircleIcon className="h-3 w-3 mr-1" />,
        "created": <PlusCircleIcon className="h-3 w-3 mr-1" />
    };
    return (
        <Card className="group relative overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="p-4 space-y-4">
                {/* ===== Game Header ===== */}
                <div className="flex items-center justify-between">
                    {game.players.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <CustomAvatar
                                size="sm"
                                src={game.players[0]?.profile_url}
                                alt="profile_url"
                                fallback={
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                        {game.players[0].username?.charAt(0).toUpperCase()}
                                    </div>
                                }
                            />

                            <div className="text-xs font-medium">vs</div>
                            {game.players.length === 2 ? (
                                <CustomAvatar
                                    size="sm"
                                    src={game.players[1].profile_url}
                                    alt="profile_url"
                                    fallback={
                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                            {game.players[1].username?.charAt(0).toUpperCase()}
                                        </div>
                                    }
                                />
                            ) : (
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                    <QuestionMarkIcon />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                <QuestionMarkIcon />
                            </div>
                            <div className="text-xs font-medium">vs</div>
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                <QuestionMarkIcon />
                            </div>
                        </div>
                    )}

                    <Badge variant="outline" className={`gap-1 ${statusColors[game.game_settings.status]}`}>
                        {statusIcons[game.game_settings.status]}
                        {
                            game.game_settings.status === "matched" ? "Playing" :
                                game.game_settings.status === "in_queue" ? "In queue" :
                                    game.game_settings.status.charAt(0).toUpperCase() + game.game_settings.status.slice(1)
                        }
                    </Badge>
                </div>

                {/* ===== Game Info ===== */}
                <div className="space-y-2">
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <GameControllerIcon className="h-4 w-4" />
                        Tic-Tac-Toe Match
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {game.players.length > 0 ? (
                            <div className="flex items-center gap-6  text-muted-foreground">
                                {game.players[0].username} ({game.players[0].played_as})
                                {game.players.length === 2 ? (
                                    <div className="flex items-center gap-2">
                                        {game.players[1].username} ({game.players[1].played_as})
                                    </div>
                                ) : (

                                    <div className="flex items-center gap-2">
                                        <QuestionMarkIcon /> ({game.players[0].played_as === "X" ? "O" : "X"})
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <QuestionMarkIcon /> (?)
                                </div>
                                <div className="flex items-center gap-2">
                                    <QuestionMarkIcon /> (?)
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Actions ===== */}
                <div className="flex items-center gap-2">
                    <Button
                        disabled={game.game_settings.status === "in_queue"}
                        size="icon-sm"
                        variant="ghost"
                        className="hover:bg-destructive/20! bg-destructive/30! text-destructive! hover:text-destructive"
                    >
                        <TrashIcon />
                    </Button>

                    <Button
                        disabled={game.game_settings.status === "in_queue"}
                        size="icon-sm"
                        variant="ghost"
                        className="hover:bg-blue-500/10! bg-blue-500/20! text-blue-500 hover:text-blue-500"
                    >
                        <GearIcon />
                    </Button>
                </div>

                {/* Action Button */}
                <Button
                    variant={(game.game_settings.status === "matched" || game.game_settings.status === "created") ? "default" : "outline"}
                    size="sm"
                    className="w-full gap-2"
                    disabled={game.game_settings.status === "in_queue"}
                >
                    {game.game_settings.status === "matched" ? (
                        <>
                            <ArrowRightIcon className="h-4 w-4" />
                            Continue game
                        </>
                    ) : game.game_settings.status === "in_queue" ? (
                        <>
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            Searching...
                        </>
                    ) : game.game_settings.status === "finished" ? (
                        <>
                            <CheckCircleIcon className="h-4 w-4" />
                            View
                        </>
                    ) : game.game_settings.status === "created" ? (
                        <>
                            <MagnifyingGlassPlusIcon />
                            Search for an opponent
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="h-4 w-4" />
                            View
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
};