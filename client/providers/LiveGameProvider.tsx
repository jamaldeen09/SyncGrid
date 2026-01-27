"use client"
import ErrorCard from "@/components/reusable/ErrorCard";
import Loader from "@/components/reusable/Loader";
import { useGameState } from "@/contexts/GameStateContext";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";

const LiveGameProvider = ({ children }: { 
    children: React.ReactNode;
}): React.ReactElement => {
    // Hooks
    const { gameData } = useGameState();
    const { 
        getLiveGame, 
        gettingLiveGame,
        liveGameFetchErrMsg,
    } = useGameState();

    // Current user id
    const currentUserId = useAppSelector((state) => state.user.auth.userId)

    // Fetch live game when ths component mounts
    useEffect(() => {
        if (!gameData || !currentUserId) return;

        getLiveGame(gameData._id, currentUserId);
    }, [gameData, currentUserId]);

    // ===== Load state ===== \\
    if (gettingLiveGame) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        )
    }

    // ===== Error ui ===== \\
    if (liveGameFetchErrMsg) {
        return (
           <div className="flex h-screen justify-center items-center">
             <ErrorCard
                messageHeader="Failed to fetch live game data"
                messageDescription={liveGameFetchErrMsg}
                statusCode={400}
            />
           </div>
        )
    };

    return <>{children}</>
};

export default LiveGameProvider;