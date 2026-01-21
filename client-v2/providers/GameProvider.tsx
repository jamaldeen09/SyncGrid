"use client"
import Navbar from "@/components/main-page/Navbar";
import ErrorCard from "@/components/reusable/ErrorCard";
import Loader from "@/components/reusable/Loader";
import useApiServiceHelper from "@/hooks/useApiServiceHelper";
import { ApiResponse } from "@/lib/types/api";
import { useGetGameQuery } from "@/redux/apis/game-api";
import { setFinishedGame } from "@/redux/slices/game-slice";
import { useAppDispatch } from "@/redux/store";
import { FinishedGameData } from "@shared/index";
import { useEffect } from "react";

const GameProvider = ({ children, gameId }: {
    children: React.ReactNode;
    gameId: string;
}) => {
    // Hooks
    const { extractErrorMessage, extractValidationErrors } = useApiServiceHelper();


    // AppDispatch
    const dispatch = useAppDispatch();

    // ===== Api service ===== \\
    const {
        isLoading,
        isSuccess,
        isFetching,
        data,
        error,
        isError
    } = useGetGameQuery({ gameId });

    // Decisive boolean to show load state
    const isGettingGame = isLoading || isFetching;

    useEffect(() => {
        let isMounted = true;
        if (isMounted && isSuccess) {
            console.log("DATA RECEIVED: ", data);
            dispatch(setFinishedGame((data.data as { game: FinishedGameData }).game));
        }

        return () => {
            isMounted = false
        }
    }, [isSuccess, dispatch]);

    // Loading state
    if (isGettingGame)
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );

    // Error ui
    if (error && isError && "data" in error) {
        const message = extractErrorMessage(error);
        const validationErrors = extractValidationErrors(error);

        return (
            <div className="flex h-screen flex-col">
                <Navbar fixed={false} />
                <div className="flex-1 flex items-center justify-center">
                    {(error.status === 404) ? (
                        <ErrorCard
                            messageHeader="Game Not Found"
                            messageDescription="The match you're looking for doesn't exist or is ongoing"
                        />
                    ) : (error.status === 403) ? (
                        <ErrorCard
                            messageHeader="Access denied"
                            messageDescription={message}
                        />
                    ) : ((error.status === 400) && (validationErrors.length >= 1)) ? (
                        <ErrorCard
                            messageHeader="Validation error"
                            messageDescription="Please provide a valid game id"
                        />
                    ) : (
                        <ErrorCard
                            messageHeader="Failed to fetch game"
                            messageDescription={message}
                        />
                    )}
                </div>
            </div>
        )
    }

    return <>{children}</>
};

export default GameProvider;