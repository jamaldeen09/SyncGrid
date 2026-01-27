"use client"
import { useProfileFetch } from "@/contexts/ProfileFetchContext";
import React, { useEffect, useState } from "react";
import Loader from "@/components/reusable/Loader";
import ErrorCard from "@/components/reusable/ErrorCard";

const PublicProfileProvider = ({ children, username }: {
    children: React.ReactNode;
    username: string;
}): React.ReactElement => {
    // Is getting public profile
    const [showLoadingUi, setShowLoadingUi] = useState<boolean>(true);

    // Hooks
    const { apiService: {
        executeService,
        isLoading,
        isFetching,
        error,
        isError,
        isSuccess,
    } } = useProfileFetch();

    // Fetch the current user's profile once this component mounts
    useEffect(() => {
        if (!username) return;
        executeService(username);
    }, [username]);

    useEffect(() => {
        if (isSuccess) setShowLoadingUi(false);
        if (isError && error) setShowLoadingUi(false);
    }, [isSuccess, error, isError])

    // Is pending
    const isPending = isLoading || isFetching

    // Load state 
    if (isPending || showLoadingUi) return (
        <div className="flex h-screen justify-center items-center">
            <Loader />
        </div>
    );

    if (error && isError && "data" in error) {
        // Error status
        const status = typeof error.status === "number" ? error.status : 400;

        /**
         * Map status codes to technical dossier terminology
         * @param code 
         */
        const getErrorMessage = (code: number) => {
            switch (code) {
                case 404:
                    return {
                        header: "USER_NOT_FOUND",
                        description: "The requested username does not exist in the SyncGrid directory. Registry lookup failed."
                    };
                case 500:
                    return {
                        header: "SERVER_ERROR",
                        description: "Something went wrong on our end. We're having trouble reaching the database right now."
                    };
                default: // Handles 400 and others
                    return {
                        header: "REQUEST_ERROR",
                        description: "The system couldn't process this request. Please check your connection or try again."
                    };
            }
        };

        // Header and description
        const {
            header,
            description
        } = getErrorMessage(status);
        return (
            <div className="h-screen flex items-center justify-center p-6 bg-[#F8F8F8]">
                <ErrorCard
                    messageHeader={header}
                    messageDescription={description}
                    statusCode={status}
                />
            </div>
        );
    }

    return <>{children}</>
};

export default PublicProfileProvider;