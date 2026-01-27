"use client"
import useApiServiceHelper from "@/hooks/useApiServiceHelper";
import { ApiResponse } from "@/lib/types/api";
import { callToast } from "@/providers/SonnerProvider";
import { useLazyGetGamesQuery } from "@/redux/apis/game-api";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GamesPayload, GetGamesData } from "@shared/index";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";


// Contexts initial state
export interface GameFetchContextInitialState {
    // ===== Filters ===== \\
    filters: (Omit<GetGamesData, "page" | "limit"> & {
        page: number;
        limit: number;
    });
    addFilter: (updater: GetGamesData) => void;
    clearFilters: () => void;

    // ===== Games fetch result ===== \\
    gamesFetchResult: GamesPayload | null;
    resetGameFetchState: () => void;

    // Goes to next page
    goToNextPage: () => void,

    // ===== Api service ===== \\
    apiService: {
        executeService: (userId: string) => Promise<void>;
        isLoading: boolean;
        isSuccess: boolean;
        error: FetchBaseQueryError | SerializedError | undefined;
        isError: boolean;
        isFetching: boolean;
        data: ApiResponse | undefined;
    }
};


// ===== Actual Context ===== \\
export const GamesFetchContext = createContext<GameFetchContextInitialState | null>(null);

// ===== Context provider ===== \\
export const GamesFetchContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // States
    const [filters, setFilters] = useState<(Omit<GetGamesData, "page" | "limit"> & {
        page: number;
        limit: number;
    })>({ page: 1, limit: 10 });
    const [gamesFetchResult, setGamesFetchResult] = useState<GamesPayload | null>(null);

    // Hooks
    const { extractErrorMessage } = useApiServiceHelper()

    // ==== Api service ==== \\
    const [getGames, {
        isLoading,
        isError,
        error,
        isSuccess,
        data,
        isFetching,
    }] = useLazyGetGamesQuery();

    // Resets the game fetch state
    const resetGameFetchState = useCallback(() => {
        setFilters({ page: 1, limit: 10 })
        setGamesFetchResult(null);
    }, [])

    // Function to fetch the games
    const executeService = useCallback(async (userId: string) => {
        try {
            const result = await getGames({
                ...filters,
                userId,
            }).unwrap();

            // If it's the first page, explicitly set the result to clear any old data
            // even if RTK Query served this from cache.
            if (result && result.data && filters.page === 1) {
                setGamesFetchResult(result.data as GamesPayload);
            }
        } catch (err) {
            console.error(`Games fetch error\nFile: GameFetchContext.tsx\nFunction: executeService\nError: ${err}`);
        }
    }, [filters, getGames]);

    // Goes to next page
    const goToNextPage = useCallback(() => {
        setFilters((prevState) => ({
            ...prevState,
            page: (prevState.page ? prevState.page + 1 : 1)
        }));
    }, []);

    // Add filter
    const addFilter = useCallback((updater: GetGamesData) => {
        if (Object.keys(updater).length <= 0) return;

        setFilters((prevState) => ({
            ...prevState,
            ...updater,
            page: 1,
            limit: 10,
        }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setFilters({ page: 1, limit: 10 });
    }, []);

    // ===== useEffect to handle the operation  ===== \\
    useEffect(() => {
        if (isSuccess && data) {
            const expectedData = data.data as GamesPayload;

            // If it's page 1, we replace the whole state
            if (expectedData.page === 1) {
                setGamesFetchResult(expectedData);
            }
            // If it's page > 1, we merge
            else if (expectedData.page > 1) {           
                setGamesFetchResult((prev) => {
                    if (!prev) return expectedData;

                    const combinedGames = [...prev.games, ...expectedData.games];

                    // Remove duplicates by ID
                    const uniqueGames = Array.from(
                        new Map(combinedGames.map(item => [item._id, item])).values()
                    );

                    return {
                        ...expectedData,
                        games: uniqueGames,
                    };
                });
            }
        }

        if (isError && error && "data" in error) {
            callToast.error(extractErrorMessage(error));
        }
    }, [isSuccess, data, isError, error]);

    // Context Values
    const contextValues = useMemo((): GameFetchContextInitialState => ({
        // ===== Filters ===== \\
        filters,
        addFilter,
        clearFilters,

        // ===== Games fetch result ===== \\
        gamesFetchResult,
        resetGameFetchState,

        // ===== Goes to next page ===== \\
        goToNextPage,

        // ===== Api service ===== \\
        apiService: {
            executeService,
            isLoading,
            isFetching,
            error,
            isError,
            data,
            isSuccess,
        }
    }), [
        filters,
        addFilter,
        clearFilters,
        gamesFetchResult,
        executeService,
        isLoading,
        isFetching,
        isError,
        error,
        data,
        isSuccess,
        goToNextPage,
    ]);
    return (
        <GamesFetchContext.Provider value={contextValues}>
            {children}
        </GamesFetchContext.Provider>
    )
};

// Hook to use the context
export const useGameFetch = () => {
    const context = useContext(GamesFetchContext);
    if (!context) throw new Error("useGameFetch must be used within a GameFetchContextProvider");
    return context;
}


