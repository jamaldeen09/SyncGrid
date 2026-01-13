"use client"
import Loader from "@/components/reusable/Loader";
import { useGetCurrentUserProfileQuery } from "@/redux/apis/profile-api";
import { clearAuth, clearProfile, setProfile } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { ProfileType } from "@shared/index";
import React, { useEffect } from "react";

const ProfileProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // AppDispatch
    const dispatch = useAppDispatch();

    // ===== Api service ===== \\
    const {
        isLoading,
        isFetching,
        data,
        isSuccess,
        error,
        isError
    } = useGetCurrentUserProfileQuery();
    const isPending = isLoading || isFetching;

    useEffect(() => {
        let isMounted = true;

        // Initialize auth
        if (isSuccess && isMounted) {
            dispatch(
                setProfile(
                    (data.data as {
                        profile: ProfileType
                    }).profile
                )
            );
        };

        if (isError && error && "data" in error && isMounted) {
            // Clear auth and profile states if any unauthorized
            // response is received
            if (error.status === 401) {
                dispatch(clearAuth());
                dispatch(clearProfile());
            };
        }

        return () => {
            isMounted = false;
        }
    }, [isSuccess, data, dispatch, isError, error]);

    // Is pending
    if (isPending) return (
        <div className="flex h-screen justify-center items-center">
            <Loader />
        </div>
    );

    return <>{children}</>
};

export default ProfileProvider;