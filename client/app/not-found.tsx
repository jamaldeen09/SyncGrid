"use client"
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/main-page/Navbar";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "@/components/reusable/game/Square"
import AuthProvider from "@/providers/AuthProvider";
import PrivateProfileProvider from "@/providers/PrivateProfileProvider";
import { winningCombinations } from "@/lib/utils";


// ===== Action button ===== \\
const NotFoundPageGameActionButton = ({ type, className, size = "xs", text, onClick }: {
    type: "primary" | "destructive" | "white",
    text: string,
    className?: string;
    size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
    onClick?: () => void
}) => {
    // Classnames
    const classNames = {
        "white": "text-white hover:bg-white/10! hover:text-white",
        "primary": "text-primary hover:bg-primary/10! hover:text-primary",
        "destructive": "text-destructive hover:bg-destructive/10! hover:text-destructive"
    };
    return (
        <Button
            onClick={onClick}
            size={size}
            variant="ghost"
            className={`${classNames[type]} text-[10px] ${className}`}
        >
            {text}
        </Button>
    )
}

// ===== Not found page ===== \\
const NotFoundPage = () => {
    // Local states
    const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
    const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
    const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
    const [playPreference, setPlayPreference] = useState<"X" | "O" | null>(null);
    const [showPreferenceOption, setShowPreferenceOption] = useState<boolean>(false);


    // Function to get the winner
    const getWinner = useCallback((): ({
        winner: "X" | "O" | null;
        winningCombination: [number, number, number] | null;
    }) => {
        for (const [a, b, c] of winningCombinations) {
            if ((board[a] && board[a] === board[b]) && (board[a] === board[c])) {
                return {
                    winner: board[a],
                    winningCombination: [a, b, c]
                };
            }
        };

        return {
            winner: null,
            winningCombination: null,
        }
    }, [board])


    // ===== Variable to determine if the game has truly started ===== \\
    const hasGameTrulyStarted = hasGameStarted && playPreference;

    // ===== Variables to determine if the user playing is the winner or the loser ===== \\
    const isCurrentPlayerWinner = hasGameTrulyStarted && getWinner().winner && getWinner().winner === playPreference;
    const isCurrentPlayerLost = hasGameTrulyStarted && getWinner().winner && getWinner().winner !== playPreference;

    // ===== Variable to determine if the game has finished ===== \\
    const isDraw = board.filter((value) => value !== null).length >= 9;

    // ===== Variable to determine if the game has finished ===== \\
    const isGameFinished = isDraw || (getWinner().winner !== null);

    // Function to start game
    const startGame = useCallback((playPreference: "X" | "O") => {
        if (hasGameTrulyStarted) return;

        setHasGameStarted(true);
        setPlayPreference(playPreference);
        setShowPreferenceOption(false);
    }, [hasGameTrulyStarted])

    // Function to quit game
    const boardIndexGenerator = useCallback(() => {
        if (!hasGameTrulyStarted || isGameFinished) return;
        let emptySquares: number[] = [];
        for (let i = 0; i < board.length; i++) {
            const square = board[i];
            if ((square === "X") || (square === "O")) continue;

            emptySquares.push(i);
        }

        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        return emptySquares[randomIndex]
    }, [hasGameTrulyStarted, isGameFinished])

    // Function to play a new move
    const newMove = useCallback((value: "X" | "O", location: number) => {
        if ((getWinner().winner || currentTurn !== value) || (!hasGameTrulyStarted)) return;

        // ===== Update board ===== \\
        let boardState = [...board];
        boardState[location] = value;
        setBoard(boardState)

        // ===== Check winner ===== \\
        const result = getWinner();

        // ===== Update the current turn (if there isn't a winner) ===== \\
        if (result.winner) return;
        setCurrentTurn(value === "X" ? "O" : "X");
    }, [getWinner, board, currentTurn, hasGameTrulyStarted]);

    // Reset game
    const resetGame = () => {
        setHasGameStarted(false)
        setPlayPreference(null);
        setCurrentTurn("X");
        setBoard(Array(9).fill(null));
        setShowPreferenceOption(false);
    }

    // Play again
    const playAgain = () => {
        setBoard(Array(9).fill(null));
        setCurrentTurn("X");
    }

    // ===== Fake ai useEffect ===== \\

    // UseEffect to act as the ai playing moves
    useEffect(() => {
        // If game has not started dont run this useEffect
        if (!hasGameTrulyStarted || isGameFinished) return;

        // Otherwise if game has started check whos turn it is
        // and check what this useEffect is playing as
        const playingAs = playPreference === "X" ? "O" : "X";
        if (currentTurn !== playingAs) return;

        // Make a new move
        const generatedIndex = boardIndexGenerator();
        setTimeout(() => newMove(playingAs, generatedIndex!), 400)

    }, [currentTurn, hasGameTrulyStarted, isGameFinished, playPreference]);
    return (
        <AuthProvider>
            <PrivateProfileProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar fixed={false} />
                    <div className="w-full flex-1 flex justify-center items-center">
                        <Card className="w-full max-w-2xl h-full bg-muted/5 flex flex-col md:px-0 px-4">

                            {/* Text */}
                            <div className="w-full max-w-xl mx-auto">
                                <div className="flex md:items-center flex-col md:flex-row gap-4">
                                    <h1 className="text-6xl md:text-7xl text-primary">404</h1>

                                    <div className="flex flex-col text-muted-foreground text-xs md:text-sm">
                                        <p>PAGE NOT FOUND!</p>
                                        <p>Return to the <Link href="/" className="text-primary hover:underline">home page</Link> or play a quick game</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mini game */}
                            <div className="w-full max-w-md mx-auto p-4">
                                {/* Status Header */}
                                <header className="flex items-center justify-between mb-6">
                                    {hasGameStarted && (
                                        <>
                                            <div className={`text-primary font-black text-[10px]`}>
                                                {isCurrentPlayerWinner ? "Congratulations you won!" :
                                                    isCurrentPlayerLost ? "Oh oh you lost!" :
                                                        isDraw ? "Its a tie!" :
                                                            `Turn: ${currentTurn}`}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isGameFinished && (
                                                    <NotFoundPageGameActionButton
                                                        onClick={playAgain}
                                                        type="primary"
                                                        text="Play again"
                                                    />
                                                )}

                                                <NotFoundPageGameActionButton
                                                    onClick={resetGame}
                                                    type="destructive"
                                                    text="Reset"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {showPreferenceOption && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-muted-foreground text-[10px]">
                                                What would you like to play as?
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <NotFoundPageGameActionButton
                                                    onClick={() => startGame("X")}
                                                    size="icon-xs"
                                                    type="primary"
                                                    text="X"
                                                />

                                                <NotFoundPageGameActionButton
                                                    onClick={() => startGame("O")}
                                                    size="icon-xs"
                                                    type="white"
                                                    text="O"
                                                />

                                                <NotFoundPageGameActionButton
                                                    onClick={() => setShowPreferenceOption(false)}
                                                    type="destructive"
                                                    text="Cancel"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!hasGameStarted && !showPreferenceOption && (
                                        <NotFoundPageGameActionButton
                                            onClick={() => setShowPreferenceOption(true)}
                                            type="primary"
                                            text="Start game"
                                        />
                                    )}
                                </header>

                                {/* The Grid */}
                                <div className="grid grid-cols-3 w-full aspect-square border border-border/50 bg-card/30 backdrop-blur-sm">
                                    {board.map((value, i) => {
                                        const disableSquare = !hasGameTrulyStarted || isGameFinished;
                                        return (
                                            <Square
                                                onClick={() => newMove(playPreference!, i)}
                                                disableSquare={disableSquare}
                                                key={i}
                                                value={!value ? i + 1 : value}
                                                isWinningSquare={((getWinner()?.winningCombination || []).some((val) => val === i)) || false}
                                            />
                                        )
                                    })}
                                </div>

                                {/* Footer Metadata */}
                                <div className="mt-4 border-t border-border/20 pt-2">
                                    <p className="text-[9px] font-mono text-muted-foreground/50 uppercase italic text-right">
                                        SyncGrid
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </PrivateProfileProvider>
        </AuthProvider>
    );
};

export default NotFoundPage;