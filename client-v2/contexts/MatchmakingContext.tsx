"use client"
import { events } from "@/lib/socket/events";
import socket from "@/lib/socket/socket";
import { callToast } from "@/providers/SonnerProvider";
import { useLazyGetSessionQuery } from "@/redux/apis/auth-api";
import { clearAuth, setPartialAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { ListenerCallbackArgs, SessionData } from "@shared/index";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUi } from "./UiContext";
import Loader from "@/components/reusable/Loader";

// Context's initial state type
export interface MatchmakingContextInitialState {
    isFindingMatch: boolean;
    setIsFindingMatch: React.Dispatch<React.SetStateAction<boolean>>;
    isCancelingMatchmaking: boolean;
    setIsCancelingMatchmaking: React.Dispatch<React.SetStateAction<boolean>>;
    findMatch: (isAuthenticated: boolean, userId: string, preference: "X" | "O") => Promise<void>;
    cancelOpponentSearch: (isAuthenticated: boolean, userId: string, preference: "X" | "O") => Promise<void>;
};

// Actual context
export const MatchmakingContext = createContext<MatchmakingContextInitialState | null>(null);

// Context provider
export const MatchmakingContextProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    // Local states
    const [isFindingMatch, setIsFindingMatch] = useState<boolean>(false);
    const [isCancelingMatchmaking, setIsCancelingMatchmaking] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    // Hooks
    const { openUi, closeUi } = useUi();

    // ===== Get session api service =====  \\
    const [getSession, {
        isLoading,
        isFetching
    }] = useLazyGetSessionQuery()

    // Function to find match
    const findMatch = useCallback(async (isAuthenticated: boolean, userId: string, preference: "X" | "O") => {
        let currentUserId = userId;
        let currentIsAuthenticated = isAuthenticated;

        try {
            // If we don't have a session, get it first
            if (!currentIsAuthenticated || !currentUserId) {
                const result = await getSession().unwrap();
                const sessionData = result.data as SessionData;

                // Update Redux so the UI stays in sync
                dispatch(setPartialAuth(sessionData));

                // UPDATE our local pointers so the socket gets the right data
                currentUserId = sessionData.userId;
                currentIsAuthenticated = true;
            }

            // Now that we DEFINITELY have a user (or the catch block triggered), emit
            setIsFindingMatch(true);

            socket.emit(events.findOpponent, { preference }, (response: ListenerCallbackArgs) => {
                if (response.success) return;
                setIsFindingMatch(false);
                callToast.error(response.message);
            });

        } catch (err) {
            setIsFindingMatch(false);
            callToast.error("Session expired. Please log in again.");
            dispatch(clearAuth());
        }
    }, [socket, getSession, dispatch]);

    // Function to cancel opponent search
    const cancelOpponentSearch = useCallback(async (isAuthenticated: boolean, userId: string, preference: "X" | "O") => {
        let currentUserId = userId;
        let currentIsAuthenticated = isAuthenticated;

        try {
            if (!currentIsAuthenticated || !currentUserId) {
                const result = await getSession().unwrap();
                const sessionData = result.data as SessionData;

                dispatch(setPartialAuth(sessionData));

                currentUserId = sessionData.userId;
                currentIsAuthenticated = true;
            }

            setIsCancelingMatchmaking(true);
            socket.emit(events.cancelMatchmaking, ({ preference}), (response: ListenerCallbackArgs) => {
                setIsFindingMatch(false);
                setIsCancelingMatchmaking(false);
                if (response.success)
                    return callToast.success(response.message);

                callToast.error(response.message);
            });
        } catch (err) {
            setIsFindingMatch(false);
            callToast.error("Session expired. Please log in again.");
            dispatch(clearAuth());
        }
    }, [socket]);

    // Contexts value
    const contextValue = useMemo(() => ({
        isFindingMatch,
        setIsFindingMatch,
        findMatch,
        cancelOpponentSearch,
        isCancelingMatchmaking,
        setIsCancelingMatchmaking,
    } as MatchmakingContextInitialState), [
        findMatch,
        isFindingMatch,
        isCancelingMatchmaking,
        cancelOpponentSearch,
        setIsCancelingMatchmaking,
    ]);

    return (
        <MatchmakingContext.Provider value={contextValue}>
            {(isLoading || isFetching) && (
                <div className="flex justify-center items-center inset-0 fixed top-0 h-full backdrop-blur-sm
                z-100 bg-white">
                    <Loader message="Renewing session..." />
                </div>
            )}
            {children}
        </MatchmakingContext.Provider>
    )
}


// Hook to use the context
export const useMatchmaking = () => {
    const context = useContext(MatchmakingContext);
    if (!context)
        throw new Error("useMatchmaking must be used within a MatchmakingContextProvider");

    return context;
}