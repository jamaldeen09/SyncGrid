import {
    GameControllerIcon,
    PlusIcon,
    EyeIcon,
    LightningIcon,
    ClockIcon,
    CheckCircleIcon,
    HourglassIcon,
} from "@phosphor-icons/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


export interface PublicGameCardProps {
    game: {
        players: [string, string];
        status: "playing" | "waiting" | "finished";
        moves: number;
    };
    index: number;
}

export const PublicGameCard = ({ game, index }: PublicGameCardProps) => {
    const statusColors = {
        playing: "bg-green-500/20 text-green-500 border-green-500/30",
        waiting: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        finished: "bg-muted text-muted-foreground border-muted"
    };

    const statusIcons = {
        playing: <LightningIcon weight="fill" className="h-3 w-3 mr-1" />,
        waiting: <HourglassIcon className="h-3 w-3 mr-1" />,
        finished: <CheckCircleIcon className="h-3 w-3 mr-1" />
    };

    const playerColors = [
        "bg-gradient-to-br from-primary to-primary/70",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-green-500 to-emerald-600",
        "bg-gradient-to-br from-blue-500 to-blue-600"
    ];

    return (
        <Card className="group relative overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="p-4 space-y-4">
                {/* Game Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {game.players.map((player, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full ${playerColors[(index + i) % playerColors.length]} flex items-center justify-center text-xs font-bold text-white`}
                                >
                                    {player.charAt(0)}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs font-medium">vs</div>
                    </div>
                    <Badge variant="outline" className={`gap-1 ${statusColors[game.status]}`}>
                        {statusIcons[game.status]}
                        {game.status === "playing" ? "Live" : game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </Badge>
                </div>

                {/* Game Info */}
                <div className="space-y-2">
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <GameControllerIcon className="h-4 w-4" />
                        Tic-Tac-Toe Match
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {game.players[0]} vs {game.players[1]}
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            Moves
                        </span>
                        <span className="font-medium">{game.moves}/9</span>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    variant={game.status === "playing" ? "default" : "outline"}
                    size="sm"
                    className="w-full gap-2"
                >
                    {game.status === "playing" ? (
                        <>
                            <EyeIcon className="h-4 w-4" />
                            Spectate
                        </>
                    ) : game.status === "waiting" ? (
                        <>
                            <PlusIcon className="h-4 w-4" />
                            Join
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