"use client"
import { useAppSelector } from "@/redux/store";

const UnauthenticatedRouteProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    // Global state to determine if a user is authenticated
    // or not
    const isAuthenticated = useAppSelector((state) => state.user.auth.isAuthenticated);

    // Only render the unauthenticated
    // route if the user is not authenticated
    if (!isAuthenticated)
        return (<>{children}</>)

    return <></>
};

export default UnauthenticatedRouteProvider;