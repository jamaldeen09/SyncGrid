import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HourglassIcon, UsersIcon, XIcon } from "@phosphor-icons/react";
import socket from "@/lib/socket";
import { callToast } from "@/providers/SonnerProvider";
import {useAppSelector } from "@/redux/store";
import { SocketResponse } from "@/lib/types";
import { useUi } from "@/contexts/UiContext";

const FindingOpponent = () => {
    const searchStartTime = useRef<number>(Date.now());
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const searchingForMatchRef = useRef<boolean>(false);
    const [isCancelingOpponentSearch, setIsCancelingOpponentSearch] = useState<boolean>(false);

    // Hooks
    const { matchmakingGameId } = useAppSelector((state) => state.game);
    const { openUi } = useUi()


    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - searchStartTime.current) / 1000);
            setElapsedSeconds(elapsed);
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    // Calculate display values
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    // Format as MM:SS
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Emit an event to join game room when this component mounts
    useEffect(() => {
        if (searchingForMatchRef.current) return;

        // Prevents attempting to join rooms if socket isn't connected
        if (!socket.connected) {
            callToast("error", "A connection has not been established, please try again shortly");
            return;
        }

        // Emit an event for matchmaking when this component mounts
        socket.emit("join_game_room", { gameId: matchmakingGameId, matchmaking: false });
        searchingForMatchRef.current = true;
    }, []);


    // Cancels the search for an opponent after creating a game
    const handleCancelSearch = () => {
        // Prevent attemting to cancel search if connection isn't established
        if (!socket.connected) {
            callToast("error", "A connection has not been established, please try again shortly");
            return;
        }

        setIsCancelingOpponentSearch(true);

        // Emit an event 
        socket.emit("cancel_search", { gameId: matchmakingGameId }, (response: SocketResponse) => {
            setIsCancelingOpponentSearch(false);

            if (!response.success) {
                callToast("error", response.message);
                return;
            }

            openUi("findingOpponent")
        });
    };
    return (
        <div className="flex flex-col items-center justify-cente text-center space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Finding an Opponent</h2>
            </div>

            {/* Animated Tic-Tac-Toe loader */}
            <div className="relative my-6">
                <div className="loader">
                    <div className="square" id="sq1"></div>
                    <div className="square" id="sq2"></div>
                    <div className="square" id="sq3"></div>
                    <div className="square" id="sq4"></div>
                    <div className="square" id="sq5"></div>
                    <div className="square" id="sq6"></div>
                    <div className="square" id="sq7"></div>
                    <div className="square" id="sq8"></div>
                    <div className="square" id="sq9"></div>
                </div>
            </div>

            {/* Stats and info */}
            <div className="space-y-4 max-w-sm w-full mt-6">
                {/* Time waiting */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-xs">
                        <HourglassIcon className="h-4 w-4" />
                        <span>Time waiting</span>
                    </div>
                    <span className="font-semibold text-xs">
                        {formattedTime}
                    </span>
                </div>

                {/* Players online */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-xs">
                        <UsersIcon className="h-4 w-4" />
                        <span>Players online</span>
                    </div>
                    <span className="font-semibold text-xs">{24}</span>
                </div>
            </div>

            {/* Cancel button */}
            <Button
                disabled={isCancelingOpponentSearch}
                onClick={handleCancelSearch}
                variant="destructive"
                size="lg"
                className="gap-2"
            >
                <XIcon className="h-5 w-5" />
                {isCancelingOpponentSearch ? "Canceling..." : "Cancel Search"}
            </Button>

            {/* Optional: Search tips rotation */}
            <div className="text-sm text-muted-foreground animate-pulse">
                Searching for opponent...
            </div>
        </div>
    );
};

export default FindingOpponent;