"use client"
import Loader from "@/components/reusable/Loader";
import { useLazyGetCurrentUsersProfileQuery } from "@/redux/apis/profile-api";
import { setProfile } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { UiProfileType } from "@shared/index";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const PrivateProfileProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // Local states 
    const [showLoadingUi, setShowLoadingUi] = useState<boolean>(true);

    // AppRouterInstance
    const router = useRouter();

    // Dispatch
    const dispatch = useAppDispatch();

    // ===== Api service ===== \\
    const [fetchProfile, {
        isLoading,
        isFetching,
        isSuccess,
        data,
        error,
        isError
    }] = useLazyGetCurrentUsersProfileQuery();

    const executeService = useCallback(async () => {
        try {
            const result = await fetchProfile().unwrap();
            if (result && result.data) {
                setShowLoadingUi(false);
                dispatch(setProfile((result.data as { profile: UiProfileType }).profile));
            }
        } catch (err) {
            setShowLoadingUi(false);
            console.error(`Profile fetch error\nFile: PrivateProfileProvider.tsx\nFunction: executeService\n${err}`);
            router.push("/");
        }
    }, [fetchProfile]);

    // ===== UseEffect to fetch the current user's profile ===== \\
    useEffect(() => {
        executeService();
    }, [])

    // ===== Use effect to initialize the current user's profile ===== \\
    useEffect(() => {
        if (isSuccess) {
            setShowLoadingUi(false)
            dispatch(setProfile((data.data as { profile: UiProfileType }).profile));
        };

        if (error && isError) {
            setShowLoadingUi(false);
            router.push("/");
        }
    }, [isSuccess, data, error, isError]);

    // Load state
    if ((isLoading || isFetching || showLoadingUi))
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );


    // Children
    return <>{children}</>
};

export default PrivateProfileProvider;