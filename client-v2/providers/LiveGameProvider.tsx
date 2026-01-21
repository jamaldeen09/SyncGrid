"use client"
import ErrorCard from "@/components/reusable/ErrorCard";
import Loader from "@/components/reusable/Loader";
import { events } from "@/lib/socket/events";
import socket from "@/lib/socket/socket";
import { setLiveGame } from "@/redux/slices/game-slice";
import { useAppDispatch } from "@/redux/store";
import { ListenerCallbackArgs, LiveGame } from "@shared/index";
import { useCallback, useEffect, useState } from "react";

const LiveGameProvider = ({ children, gameId }: {
    children: React.ReactNode,
    gameId: string;
}): React.ReactElement => {
    // Local states
    const [errorUi, setErrorUi] = useState<{
        showErrorUi: boolean;
        messageHeader: string;
        messageDescription: string;
    }>({
        showErrorUi: false,
        messageHeader: "",
        messageDescription: "",
    });

    const [isGettingLiveGame, setIsGettingLiveGame] = useState<boolean>(false);

    // AppDispatch
    const dispatch = useAppDispatch();

    // Function to get live game
    const getLiveGame = useCallback(() => {
        setIsGettingLiveGame(true);

        socket.emit(events.getLiveGame, {
            gameId
        }, (response: ListenerCallbackArgs<{
            liveGame: LiveGame
        }>) => {

            console.log("RESPONSE UPON LIVE GAME FETCH: ", response)

            setIsGettingLiveGame(false)
            if (!response.success) {
                setErrorUi((prevState) => ({
                    ...prevState,
                    showErrorUi: true,
                    messageHeader: "Failed to fetch game",
                    messag2eDescription: response.message
                }))
            };

            // Store the live game
            dispatch(setLiveGame((response.data as { liveGame: LiveGame }).liveGame));

            // Reset error state
            setErrorUi({
                showErrorUi: false,
                messageHeader: "",
                messageDescription: "",
            })
        });
    }, [dispatch, socket, gameId]);


    // Fetch live game when ths component mounts
    useEffect(() => {
        let isMounted = true;

        if (isMounted) getLiveGame();

        return () => {
            isMounted = false
        }
    }, [getLiveGame]);

    // ===== Load state ===== \\
    if (isGettingLiveGame) {
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    // ===== Error ui ===== \\
    if (errorUi.showErrorUi) {
        return (
            <ErrorCard 
              messageHeader={errorUi.messageHeader}
              messageDescription={errorUi.messageDescription}
            />
        )
    };

    return <>{children}</>
};

export default LiveGameProvider;