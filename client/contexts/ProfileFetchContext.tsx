"use client"
import { useLazyGetPublicProfileQuery } from "@/redux/apis/profile-api";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ProfileType } from "@shared/index";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Context type
interface ProfileFetchContextType {
    // Local profile ste
    profile: ProfileType | null;
    setProfile: React.Dispatch<React.SetStateAction<ProfileFetchContextType["profile"]>>;

    // Api service
    apiService: {
        executeService: (username: string) => Promise<void>;
        isLoading: boolean;
        isFetching: boolean;
        isError: boolean;
        isSuccess: boolean;
        error: FetchBaseQueryError | SerializedError | undefined;
    }
};

// Actual context
export const ProfileFetchContext = createContext<ProfileFetchContextType | null>(null);

// Context provider
export const ProfileFetchContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // Local states
    const [profile, setProfile] = useState<ProfileType | null>(null);

    // ===== Api service =====
    const [getProfile, {
        isLoading,
        isFetching,
        isError,
        error,
        isSuccess,
        data,
    }] = useLazyGetPublicProfileQuery();


    // Execute service
    const executeService = useCallback(async (username: string) => {
        try {
            // Unwrap the promise to get the data directly from the execution
            const result = await getProfile({ username }).unwrap();

            // Manually set the profile state here instead of waiting for an effect
            if (result && result.data) {
                const typedData = (result.data as { profile: ProfileType }).profile;
                setProfile(typedData);
            }
        } catch (err) {
            console.error(`Profile fetch error\nFile: ProfileFetchContext.tsx\n${err}`);
        }
    }, [getProfile]);

    // Use Effect to handle successfull cases
    // when fetching profile
    useEffect(() => {
        if (isSuccess && data) {
            const typedData = (data.data as { profile: ProfileType }).profile;
            setProfile(typedData);
        }
    }, [isSuccess, data]);

    // Context value
    const contextValue = useMemo(() => ({
        profile,
        setProfile,
        apiService: {
            isLoading,
            isError,
            isFetching,
            isSuccess,
            data,
            error,
            executeService
        }
    }), [
        isLoading,
        isError,
        isSuccess,
        error,
        data,
        executeService,
        profile,
    ]);

    return (
        <ProfileFetchContext.Provider
            value={contextValue}
        >
            {children}
        </ProfileFetchContext.Provider>
    )
}

// Hook to use the context
export const useProfileFetch = () => {
    const context = useContext(ProfileFetchContext);
    if (!context)
        throw new Error("useProfileFetch must be used within a ProfileFetchContextProvider");

    return context;
}