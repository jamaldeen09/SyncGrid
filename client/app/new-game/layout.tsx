import AuthProvider from "@/providers/AuthProvider";
import PrivateProfileProvider from "@/providers/PrivateProfileProvider";
import React from "react";

const NewGameLayout = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    return (
        <AuthProvider>
            <PrivateProfileProvider>
                {children}
            </PrivateProfileProvider>
        </AuthProvider>
    )
};

export default NewGameLayout;