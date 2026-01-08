// components/CurrentGameCard.tsx
import {
  LightningIcon,
  HourglassIcon,
  MagnifyingGlassPlusIcon,
  GameControllerIcon,
  ClockIcon,
  QuestionMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomAvatar from "@/components/reusable/CustomAvatar";
import { Game, LiveGame } from "@/lib/types";
import { GameBoard } from "./GameBoard";
import { JSX } from "react";
import { Skeleton } from "../ui/skeleton";


export const CurrentGameCardSkeleton = () => {
  return (
      <Card className="group relative overflow-hidden border-border/40">
          <div className="p-4 space-y-4">
              {/* ===== Game Header Skeleton ===== */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      {/* Player Avatars & VS */}
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-4 h-3" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  {/* Status Badge (Live/Queue/Created) */}
                  <Skeleton className="w-20 h-6 rounded-full" />
              </div>

              {/* ===== Live Board Area (Conditional in real component) ===== */}
              {/* We include it in skeleton to reserve space for matched games */}
              <div className="pt-4 border-t">
                  <Skeleton className="w-full aspect-square max-h-40rounded-lg" />
              </div>

              {/* ===== Game Info Skeleton ===== */}
              <div className="space-y-3">
                  {/* Title: Tic-Tac-Toe Match */}
                  <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Players Info row */}
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-6" />
                      </div>
                      <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-6" />
                      </div>
                  </div>

                  {/* Time Indicators (Turn, Time Left, Moves) */}
                  <div className="space-y-2">
                      {/* Turn Indicator */}
                      <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-20" />
                      </div>
                      {/* Time Left Indicator */}
                      <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-8" />
                      </div>
                      {/* Moves count */}
                      <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-6" />
                      </div>
                  </div>
              </div>

              {/* ===== Actions (Settings / Leave Queue) ===== */}
              <div className="flex items-center gap-2">
                  <Skeleton className="w-28 h-8 rounded-md" />
              </div>

              {/* ===== Main Action Button (Full Width) ===== */}
              <Skeleton className="w-full h-9 rounded-md" />
          </div>
      </Card>
  );
};

interface CurrentGameCardProps {
  game: LiveGame;
  currentUserId: string;
  onLeaveQueue?: () => void;
  onContinueGame?: () => void;
  onSearchForOpponent?: () => void;
}

export const CurrentGameCard = ({
  game,
  currentUserId,
  onLeaveQueue,
  onContinueGame,
  onSearchForOpponent
}: CurrentGameCardProps) => {
  const statusColors: Record<LiveGame["status"], string> = {
    "matched": "bg-green-500/20 text-green-500 border-green-500/30",
    "in_queue": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    "finished": "bg-muted text-muted-foreground border-muted",
    "created": "bg-blue-500/20 text-blue-500 border-blue-500/30"
  };

  const statusIcons: Record<LiveGame["status"], JSX.Element> = {
    "matched": <LightningIcon weight="fill" className="h-3 w-3 mr-1" />,
    "in_queue": <HourglassIcon className="h-3 w-3 mr-1" />,
    "finished": <CheckCircleIcon className="h-3 w-3 mr-1" />,
    "created": <MagnifyingGlassPlusIcon className="h-3 w-3 mr-1" />
  };

  // Get current player and opponent
  const currentPlayer = game.players.find(p => p.user_id === currentUserId);
  const opponent = game.players.find(p => p.user_id !== currentUserId);

  // Check if it's current user's turn
  const isUsersTurn = currentPlayer?.playing_as === game.current_turn;

  // Calculate time left for current turn
  const getTimeLeft = () => {
    if (!currentPlayer || game.status !== "matched") return null;

    if (isUsersTurn) {
      // Show time left for current user to make a move
      return Math.floor(currentPlayer.time_left_ms / 1000);
    } else {
      // Show opponent's time left
      const opponentPlayer = game.players.find(p => p.user_id !== currentUserId);
      return opponentPlayer ? Math.floor(opponentPlayer.time_left_ms / 1000) : null;
    }
  };

  // Get time left till game gets canceled (for inactivity)
  const getInactivityTime = () => {
    if (game.status !== "matched") return null;

    // Find the player whose turn it is
    const currentTurnPlayer = game.players.find(p => p.playing_as === game.current_turn);
    return currentTurnPlayer ?
      Math.floor(currentTurnPlayer.time_left_till_deemed_unsuitable_for_match_ms / 1000) : null;
  };

  const timeLeft = getTimeLeft();
  const inactivityTime = getInactivityTime();

  return (
    <Card className="group relative overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className="p-4 space-y-4">
        {/* ===== Game Header ===== */}
        <div className="flex items-center justify-between">
          {game.players.length > 0 ? (
            <div className="flex items-center gap-2">
              <CustomAvatar
                size="sm"
                src={"https://avatars.githubusercontent.com/u/2"}
                alt="current player"
                fallback={
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                    "Y"
                  </div>
                }
              />

              <div className="text-xs font-medium">vs</div>
              {opponent ? (
                <CustomAvatar
                  size="sm"
                  src={"https://avatars.githubusercontent.com/u/2"}
                  alt="opponent"
                  fallback={
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex justify-center items-center">
                      O
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

          <Badge variant="outline" className={`gap-1 ${statusColors[game.status]}`}>
            {statusIcons[game.status]}
            {game.status === "matched" ? "Live" :
              game.status === "in_queue" ? "In Queue" :
                game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </Badge>
        </div>

        {/* ===== Live Board (only for matched games) ===== */}
        {game.status === "matched" && (
          <div className="pt-4 border-t">
            <GameBoard
              game={
                {
                  _id: "",
                  players: [],
                  moves: [],
                  game_settings: {
                    status: "finished",
                    visibility: "public",
                    time_setting_ms: 3000,
                    disabled_comments: false
                  },

                  duration_ms: 4000,
                  finished_at: new Date(),
                } as Game
              }
              currentUserId={currentUserId}
              showControls={false}
            />
          </div>
        )}

        {/* ===== Game Info ===== */}
        <div className="space-y-2">
          <div className="text-sm font-semibold flex items-center gap-2">
            <GameControllerIcon className="h-4 w-4" />
            Tic-Tac-Toe Match
          </div>

          <div className="text-xs text-muted-foreground">
            {game.players.length > 0 ? (
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <p className="w-full max-w-30 truncate">
                    {"You"}
                  </p>
                  <span>({currentPlayer?.playing_as || "?"})</span>
                </div>

                {opponent ? (
                  <div className="flex items-center gap-2">
                    <p className="w-full max-w-50 truncate">
                      {"Opponent"}
                    </p>
                    <span>({opponent.playing_as})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <QuestionMarkIcon /> (?)
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

          {/* ===== Time Indicators ===== */}
          <div className="space-y-1">
            {game.status === "matched" && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    Turn
                  </span>
                  <span>-</span>
                  <span className={`font-medium ${isUsersTurn ? "text-green-500" : "text-yellow-500"}`}>
                    {isUsersTurn ? "Your turn" : "Opponent's turn"}
                  </span>
                </div>

                {timeLeft !== null && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      Time left
                    </span>
                    <span>-</span>
                    <span className={`font-medium ${timeLeft < 10 ? "text-red-500" : "text-foreground"}`}>
                      {timeLeft}s
                    </span>
                  </div>
                )}

                {inactivityTime !== null && inactivityTime < 20 && (
                  <div className="flex items-center gap-2 text-red-500 text-xs">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      Cancel in
                    </span>
                    <span>-</span>
                    <span className="font-medium">
                      {inactivityTime}s
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Progress for matched games */}
            {(game.status === "matched" || game.status === "finished") && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Moves
                </span>
                <span>-</span>
                <span className="font-medium">{game.moves?.length || 0}/9</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex items-center gap-2">
          {game.status === "in_queue" && onLeaveQueue && (
            <Button
              onClick={onLeaveQueue}
              size="sm"
              variant="ghost"
              className="hover:bg-destructive/20! bg-destructive/30! text-destructive! hover:text-destructive"
            >
              <XIcon className="h-4 w-4 mr-1" />
              Leave Queue
            </Button>
          )}

          {game.status === "created" && (
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-blue-500/10! bg-blue-500/20! text-blue-500 hover:text-blue-500"
            >
              <GearIcon className="h-4 w-4 mr-1" />
              Settings
            </Button>
          )}
        </div>

        {/* ===== Main Action Button ===== */}
        <Button
          variant={game.status === "created" || game.status === "matched" ? "default" : "outline"}
          size="sm"
          className="w-full gap-2"
          disabled={game.status === "in_queue"}
          onClick={() => {
            if (game.status === "created" && onSearchForOpponent) {
              onSearchForOpponent();
            } else if (game.status === "matched" && onContinueGame) {
              onContinueGame();
            }
          }}
        >
          {game.status === "matched" ? (
            <>
              <ArrowRightIcon className="h-4 w-4" />
              Continue game
            </>
          ) : game.status === "in_queue" ? (
            <>
              <HourglassIcon className="h-4 w-4" />
              Searching...
            </>
          ) : game.status === "created" ? (
            <>
              <MagnifyingGlassPlusIcon className="h-4 w-4" />
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