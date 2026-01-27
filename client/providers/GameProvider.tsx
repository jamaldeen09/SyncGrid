"use client"
import ErrorCard from "@/components/reusable/ErrorCard";
import Loader from "@/components/reusable/Loader";
import { useGameState } from "@/contexts/GameStateContext";
import useApiServiceHelper from "@/hooks/useApiServiceHelper";
import { ApiResponse } from "@/lib/types/api";
import { useEffect, useState } from "react";

const GameProvider = ({ children, gameId, gameType }: {
    children: React.ReactNode;
    gameId: string;
    gameType: "live-game" | "finished-game";
}) => {
    // Local states
    const [showLoadingUi, setShowLoadingUi] = useState<boolean>(true);

    // Hooks
    const { extractErrorMessage, extractValidationErrors } = useApiServiceHelper();


    // Custom hooks
    const {
        gameFetchApiService: {
            executeService,
            isLoading,
            isFetching,
            isSuccess,
            error,
            isError
        },
    } = useGameState();

    // Decisive boolean to show load state
    const isGettingGame = isLoading || isFetching;

    // Use Effect responsible for triggering the http request
    // to the backend when this component mounts
    useEffect(() => {
        executeService(gameId, gameType)
    }, [gameId, gameType]);

    // Use effect to set the boolean responsible for showing
    // a loading ui to false
    useEffect(() => {
        if (isSuccess || (isError && error)) setShowLoadingUi(false)
    }, [isSuccess, isError, error])

    // Loading state
    if (isGettingGame || showLoadingUi)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );

    // Error ui
    if (error && isError && "data" in error) {
        const message = extractErrorMessage(error);
        const validationErrors = extractValidationErrors(error)

        return (
            <div className="flex h-screen justify-center items-center">
                {(error.status === 404) ? (
                    <ErrorCard
                        messageHeader="Game Not Found"
                        messageDescription="The match you're looking for doesn't exist or is ongoing"
                        statusCode={404}
                    />
                ) : (error.status === 400 && (error.data as ApiResponse).error?.code === "VALIDATION_ERROR") ? (
                    <ErrorCard
                        messageHeader="Validation failed"
                        messageDescription={(
                            `${validationErrors.length >= 1 ? (
                                `Validation error |
                                ${validationErrors.map((err) => {
                                    return `${err.message}`
                                })}`
                            ) : message}`
                        )}
                        statusCode={400}
                    />
                ) : (error.status === 403) ? (
                    <ErrorCard
                        messageHeader="Access denied"
                        messageDescription={message}
                        statusCode={403}
                    />
                ) : (
                    <ErrorCard
                        messageHeader="Failed to fetch game"
                        messageDescription={message}
                        statusCode={500}
                    />
                )}
            </div>
        )
    }

    return <>{children}</>
};

export default GameProvider;