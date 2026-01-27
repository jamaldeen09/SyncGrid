"use client"
import { ApiResponse } from "@/lib/types/api";
import { useLazyGetBannerLiveGameIdQuery } from "@/redux/apis/game-api";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LiveGameForBanner } from "@shared/index";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Contexts initial state
interface BannerLiveGameContextInitialState {
    bannerLiveGameId: string | null;
    setBannerLiveGameId: React.Dispatch<React.SetStateAction<string | null>>;

    apiService: ({
        executeService: () => void;
        isLoading: boolean;
        isFetching: boolean;
        error: FetchBaseQueryError | SerializedError | undefined;
        isError: boolean;
        isSuccess: boolean;
    });
};


// Actual context
export const BannerLiveGameContext = createContext<BannerLiveGameContextInitialState | null>(null);

// Context provider
export const BannerLiveGameContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // Local states
    const [bannerLiveGameId, setBannerLiveGameId] = useState<string | null>(null);

    // ===== Api service to fetch banner live game ===== \\
    const [fetchBannerLiveGameId, {
        isLoading,
        isFetching,
        error,
        isError,
        data,
        isSuccess,
    }] = useLazyGetBannerLiveGameIdQuery();



    // Function to make http request and immediately
    // grab banner live game if req is successfull
    const executeService = useCallback(async () => {
        try {
            // Result
            const result = await fetchBannerLiveGameId().unwrap();

            if (result.success && result.data) {
                const data = result.data as ({ bannerLiveGameId: string });
                setBannerLiveGameId(data.bannerLiveGameId);
            }
        } catch (err) {
            const typedErr = err as ({
                status?: (number | "CUSTOM_ERROR" | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR");
                data?: ApiResponse
            })

            if (("data" in typedErr && typedErr.data) && typedErr.status !== 404) {
                console.error(`Banner live game fetch error\nFile: BannerLiveGameContext.tsx\nFunction: executeService\n${err}`);
            }
        }
    }, [fetchBannerLiveGameId]);

    // UseEffect to handle .unwrap() bypass due to rtk query's caching
    useEffect(() => {
        if (isSuccess && data) {
            const resData = data.data as ({ bannerLiveGameId: string });
            setBannerLiveGameId(resData.bannerLiveGameId);
        }

    }, [isSuccess, data]);

    // Contexts values
    const contextValues = useMemo(() => ({
        bannerLiveGameId,
        setBannerLiveGameId,
        apiService: ({
            isLoading,
            isFetching,
            isError,
            error,
            isSuccess,
            executeService
        })
    }) as BannerLiveGameContextInitialState, [
        bannerLiveGameId,
        executeService,
        isLoading,
        isFetching,
        error,
        isError,
        isSuccess,
    ]);
    return (
        <BannerLiveGameContext.Provider value={contextValues}>
            {children}
        </BannerLiveGameContext.Provider>
    )
}


// Hook to use the context
export const useBannerLiveGame = () => {
    const context = useContext(BannerLiveGameContext);
    if (!context)
        throw new Error("useBannerLiveGame must be used within a BannerLiveGameContextProvider");

    return context
}