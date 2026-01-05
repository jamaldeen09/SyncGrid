"use client"
import FullPageLoader from "@/components/reusable/FullPageLoader";
import { useGetProfileQuery } from "@/redux/apis/profile-api";
import { clearAuth, ProfilePayload, setProfile } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import React, { useEffect } from "react";

const ProfileProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
  const dispatch = useAppDispatch()
    const {
        isFetching,
        isLoading,
        isError,
        error,
        data,
        isSuccess
    } = useGetProfileQuery();

    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess && isComponentMounted) {
            const typedData = data.data as { profile: ProfilePayload}
            dispatch(setProfile(typedData.profile));
        }

        if (isError && error && "data" in error && isComponentMounted) dispatch(clearAuth());

        return () => {
            isComponentMounted = false;
        }
    }, [
        isLoading, 
        isError, 
        error, 
        isSuccess, 
        data, 
        dispatch
    ]);

    const isPending = isFetching || isLoading;

    if (isPending) return <FullPageLoader />
    return <>{children}</>
};

export default ProfileProvider;