"use client"
import Loader from "@/components/reusable/Loader";
import { useGetCurrentUsersProfileQuery } from "@/redux/apis/profile-api";
import { setProfile } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { UiProfileType } from "@shared/index";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PrivateProfileProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // AppRouterInstance
    const router = useRouter();

    // Dispatch
    const dispatch = useAppDispatch()

    // ===== Api service ===== \\
    const {
        isLoading,
        isFetching,
        isSuccess,
        data,
        error, isError
    } = useGetCurrentUsersProfileQuery();

    // ===== Use effect to initialize the current user's profile ===== \\
    useEffect(() => {
        let isMounted = true;
        if (isSuccess && isMounted) dispatch(setProfile((data.data as { profile: UiProfileType }).profile));
        if (error && isError && isMounted) router.push("/");

        return () => {
            isMounted = false;
        }
    }, [isSuccess, data]);


    // Load state
    if ((isLoading || isFetching))
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );

    // Children
    return <>{children}</>
};

export default PrivateProfileProvider;