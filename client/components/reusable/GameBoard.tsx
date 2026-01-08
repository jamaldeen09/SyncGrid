import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Game, LiveGame } from "@/lib/types";
import { XIcon, CircleIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface BoardCell {
    value: "X" | "O" | null;
    playedBy?: {
        username: string;
        profile_url: string;
    };
    capturedAt?: Date;
    isWinningCell?: boolean;
}

interface GameBoardProps {
    game: Game;
    liveGame?: LiveGame | null;
    currentUserId?: string;
    showControls?: boolean;
    onCellClick?: (location: number) => void;
}

export const GameBoard = ({
    game,
    liveGame,
    currentUserId,
    showControls = false,
    onCellClick
}: GameBoardProps) => {
    const [board, setBoard] = useState<BoardCell[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [winningLine, setWinningLine] = useState<number[][]>([]);
    const [selectedCell, setSelectedCell] = useState<number | null>(null);

    // Initialize board from live game moves
    useEffect(() => {
        if (!liveGame?.moves) return;

        // Create empty board
        const newBoard: BoardCell[][] = Array(3).fill(null).map(() => Array(3).fill(null));

        // Place moves on board
        liveGame.moves.forEach(move => {
            if (move.location >= 0 && move.location < 9 && move.value) {
                const row = Math.floor(move.location / 3);
                const col = move.location % 3;
                newBoard[row][col] = {
                    value: move.value,
                    playedBy: move.played_by,
                    capturedAt: move.captured_at
                };
            }
        });

        // Check for winning line
        const checkWin = () => {
            // Check rows
            for (let i = 0; i < 3; i++) {
                if (newBoard[i][0]?.value &&
                    newBoard[i][0]?.value === newBoard[i][1]?.value &&
                    newBoard[i][1]?.value === newBoard[i][2]?.value) {
                    return [[i, 0], [i, 1], [i, 2]];
                }
            }
            // Check columns
            for (let i = 0; i < 3; i++) {
                if (newBoard[0][i]?.value &&
                    newBoard[0][i]?.value === newBoard[1][i]?.value &&
                    newBoard[1][i]?.value === newBoard[2][i]?.value) {
                    return [[0, i], [1, i], [2, i]];
                }
            }
            // Check diagonals
            if (newBoard[0][0]?.value &&
                newBoard[0][0]?.value === newBoard[1][1]?.value &&
                newBoard[1][1]?.value === newBoard[2][2]?.value) {
                return [[0, 0], [1, 1], [2, 2]];
            }
            if (newBoard[0][2]?.value &&
                newBoard[0][2]?.value === newBoard[1][1]?.value &&
                newBoard[1][1]?.value === newBoard[2][0]?.value) {
                return [[0, 2], [1, 1], [2, 0]];
            }
            return [];
        };

        setBoard(newBoard);
        setWinningLine(checkWin());

    }, [liveGame?.moves]);

    // Determine current player
    const currentPlayer = game.players.find(p => p._id === currentUserId);
    const opponent = game.players.find(p => p._id !== currentUserId);

    // Determine whose turn it is
    const currentTurnPlayer = liveGame?.current_turn === "X"
        ? game.players.find(p => p.played_as === "X")
        : game.players.find(p => p.played_as === "O");

    const isMyTurn = currentTurnPlayer?._id === currentUserId;
    const isGameFinished = game.game_settings.status === "finished";

    // Handle cell click
    const handleCellClick = (row: number, col: number) => {
        if (!onCellClick || !isMyTurn || isGameFinished) return;

        const location = row * 3 + col;
        if (board[row][col]?.value) return; // Cell already occupied

        setSelectedCell(location);
        onCellClick(location);
    };

    // Check if a cell is part of the winning line
    const isWinningCell = (row: number, col: number) => {
        return winningLine.some(([r, c]) => r === row && c === col);
    };

    // Get move count
    const moveCount = liveGame?.moves?.length || 0;

    return (
        <div className="space-y-4">
            {/* Game status */}
            {/* {!isGameFinished && currentTurnPlayer && (
                <div className="text-center">
                    <div className="text-muted-foreground text-xs font-medium mb-1 flex justify-center items-center">
                        {isMyTurn ? "Your turn" : <p className={`w-full ${(currentPlayer?.username || "").length >= 20 && "max-w-30 truncate"}`}>{currentTurnPlayer.username}'s turn</p>}
                    </div>
                </div>
            )} */}

            {/* Winner
            <div className="w-full flex items-center justify-center">
                <Badge>
                    Winner - lil_juice142 (X)
                </Badge>
            </div> */}

            {/* Game Board */}
            <Card className="w-full ring-0">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto size-40">
                    {board.map((row, rowIndex) => (
                        row.map((cell, colIndex) => {
                            const isWinning = isWinningCell(rowIndex, colIndex);
                            const isSelectable = !cell?.value && isMyTurn && !isGameFinished;

                            return (
                                <div key={`${rowIndex}-${colIndex}`} className="aspect-square">
                                    <button
                                        className={cn(
                                            "aspect-square w-full rounded-xl transition-all duration-200",
                                            "flex items-center justify-center relative overflow-hidden group",
                                            "bg-linear-to-br from-card to-card/80 border-2",
                                            isWinning
                                                ? "border-green-500/50 bg-green-500/10 animate-pulse"
                                                : cell?.value
                                                    ? "border-border/50"
                                                    : "border-border/50",
                                            isSelectable && "cursor-pointer hover:shadow-md"
                                        )}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        disabled={!isSelectable}
                                    >

                                        {/* Content */}
                                        {cell?.value === "X" ? (
                                            <div className="text-red-500">
                                                <XIcon weight="bold" className="h-9 w-9" />
                                            </div>
                                        ) : cell?.value === "O" ? (
                                            <div className="text-blue-500">
                                                <CircleIcon weight="bold" className="h-9 w-9" />
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/30 text-lg md:text-xl font-medium">
                                                {rowIndex * 3 + colIndex + 1}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    ))}
                </div>
            </Card>

            {/* Controls */}
            {showControls && (
                <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2 flex-1">
                        Update settings
                    </Button>
                    <Button size="sm" className="gap-2 flex-1 bg-linear-to-r from-primary to-primary/70">
                        Surrender
                    </Button>
                </div>
            )}
        </div>
    );
};