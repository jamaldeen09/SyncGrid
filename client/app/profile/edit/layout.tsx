import PrivateProfileProvider from "@/providers/PrivateProfileProvider";
import React from "react";

const EditProfileLayout = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <PrivateProfileProvider>
            {children}
        </PrivateProfileProvider>
    );
};

export default EditProfileLayout;