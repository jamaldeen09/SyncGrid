import {
    GameControllerIcon,
    CheckCircleIcon,
    QuestionMarkIcon,
    GearIcon,
    PlusCircleIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Game } from "@/lib/types";
import CustomAvatar from "./CustomAvatar";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react/dist/ssr";
import { JSX } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { GameBoard } from "./GameBoard";
import { AppDispatch } from "@/redux/store";
import { setGameBeingUpdated } from "@/redux/slices/game-slice";
import { useUi } from "@/contexts/UiContext";


export const HistoricalGameCardSkeleton = () => {
    return (
        <Card className="group relative overflow-hidden border-border/40">
            <div className="p-4 space-y-4">
                {/* ===== Game Header Skeleton ===== */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Avatar 1 */}
                        <Skeleton className="w-8 h-8" />
                        {/* "vs" text */}
                        <Skeleton className="w-4 h-3" />
                        {/* Avatar 2 */}
                        <Skeleton className="w-8 h-8" />
                    </div>
                    {/* Status Badge */}
                    <Skeleton className="w-20 h-5" />
                </div>

                {/* ===== Game Board Skeleton (Missing in original) ===== */}
                {/* This mimics the height/aspect ratio of your GameBoard component */}
                <Skeleton className="w-full aspect-square max-h-40" />

                {/* ===== Game Info Skeleton ===== */}
                <div className="space-y-3">
                    {/* Title: Tic-Tac-Toe Match */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Player Usernames Row */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-6" />
                        </div>
                    </div>

                    {/* Progress: Moves count */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>

                {/* ===== Action Buttons Skeleton ===== */}
                <div className="flex items-center gap-2">
                    {/* Settings Button */}
                    <Skeleton className="w-24 h-8" />
                </div>

                {/* ===== Main Action Button Skeleton ===== */}
                {/* View / Search Button */}
                <Skeleton className="w-full h-9" />
            </div>
        </Card>
    );
};

interface GameCardProps {
    game: Game, 
    dispatch: AppDispatch
}
export const HistoricalGameCard = (props: GameCardProps) => {
    const statusColors: Record<Game["game_settings"]["status"], string> = {
        "finished": "bg-muted text-muted-foreground border-muted",
        "created": "bg-muted text-muted-foreground border-muted"
    };

    const statusIcons: Record<Game["game_settings"]["status"], JSX.Element> = {
        "finished": <CheckCircleIcon className="h-3 w-3 mr-1" />,
        "created": <PlusCircleIcon className="h-3 w-3 mr-1" />
    };

    const { openUi } = useUi();


    const updateGame = () => {
        props.dispatch(setGameBeingUpdated({
            visibility: props.game.game_settings.visibility,
            time_setting_ms: props.game.game_settings.time_setting_ms,
            disabled_comments: props.game.game_settings.disabled_comments,
            play_as_preference: props.game.players[0].played_as,
            gameId: props.game._id
        }));

        openUi("gameUpdate")
    };
    return (
        <Card className="group relative overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="p-4 space-y-4">
                {/* ===== Game Header ===== */}
                <div className="flex items-center justify-between">
                    {props.game.players.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <CustomAvatar
                                size="sm"
                                src={props.game.players[0]?.profile_url}
                                alt="profile_url"
                                fallback={
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                        {props.game.players[0].username?.charAt(0).toUpperCase()}
                                    </div>
                                }
                            />

                            <div className="text-xs font-medium">vs</div>
                            {props.game.players.length === 2 ? (
                                <CustomAvatar
                                    size="sm"
                                    src={props.game.players[1].profile_url}
                                    alt="profile_url"
                                    fallback={
                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                                            {props.game.players[1].username?.charAt(0).toUpperCase()}
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

                    <Badge variant="outline" className={`gap-1 ${statusColors[props.game.game_settings.status]}`}>
                        {statusIcons[props.game.game_settings.status]}
                        {props.game.game_settings.status.charAt(0).toUpperCase() + props.game.game_settings.status.slice(1)}
                    </Badge>
                </div>

                {/* ===== Game Board ===== */}
                <GameBoard
                    game={props.game}
                />

                {/* ===== Game Info ===== */}
                <div className="space-y-2">
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <GameControllerIcon className="h-4 w-4" />
                        Tic-Tac-Toe Match
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {props.game.players.length > 0 ? (
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <p className="w-full max-w-30 truncate">{props.game.players[0].username}</p>
                                    <span>({props.game.players[0].played_as})</span>
                                </div>

                                {props.game.players.length === 2 ? (
                                    <div className="flex items-center gap-2">
                                        <p className="w-full max-w-50 truncate">{props.game.players[1].username}</p>
                                        <span>({props.game.players[1].played_as})</span>
                                    </div>
                                ) : (

                                    <div className="flex items-center gap-2">
                                        <QuestionMarkIcon /> ({props.game.players[0].played_as === "X" ? "O" : "X"})
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <QuestionMarkIcon /> (?)
                                </div>
                                <div className="flex items-center gap-2">
                                    <QuestionMarkIcon /> (?)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                Moves
                            </span>
                            <span>-</span>
                            <span className="font-medium">{props.game.moves.length}/9</span>
                        </div>
                    </div>
                </div>

                {/* ===== Actions ===== */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={updateGame}
                        size="sm"
                        variant="ghost"
                        className="hover:bg-blue-500/10! bg-blue-500/20! text-blue-500 hover:text-blue-500"
                    >
                        Settings
                        <GearIcon />
                    </Button>
                </div>

                {/* Action Button */}
                <Button
                    variant={props.game.game_settings.status === "created" ? "default" : "outline"}
                    size="sm"
                    className="w-full gap-2"
                >
                    {props.game.game_settings.status === "finished" ? (
                        <>
                            <CheckCircleIcon className="h-4 w-4" />
                            View
                        </>
                    ) : props.game.game_settings.status === "created" ? (
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