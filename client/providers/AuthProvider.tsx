"use client"
import FullPageLoader from "@/components/reusable/FullPageLoader";
import { useGetSessionQuery } from "@/redux/apis/auth-api";
import { AuthType, clearAuth, setPartialAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: {
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
    } = useGetSessionQuery();

    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess && isComponentMounted) {
            const typedData = data.data as { auth: Omit<AuthType, "isAuthenticated">}
            dispatch(setPartialAuth(typedData.auth));
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

export default AuthProvider;