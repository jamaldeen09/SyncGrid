"use client"
import { ModalComponentPropsType } from "@/providers/ModalsProvider";
import React from "react";
import Modal, { ModalPropsType } from "../reusable/Modal";
import EditProfile from "../modal-content/profile/EditProfile";
import useEditProfile from "@/hooks/profile/useEditProfile";
import { useProfileFetch } from "@/contexts/ProfileFetchContext";
import { defaultProfileUrl } from "@/lib/utils";
import { useLazyGetCurrentUsersProfileQuery } from "@/redux/apis/profile-api";

const EditProfileModal = (props: ModalComponentPropsType): React.ReactElement => {
    // Global states
    const {
        profile, 
        apiService: { executeService: getProfile } 
    } = useProfileFetch();
    const [getCurrentUsersProfile] = useLazyGetCurrentUsersProfileQuery();

    // ==== Api service ===== \\
    const {
        executeService,
        isLoading,
        extra,
    } = useEditProfile({
        profile,
        getProfile,
        getCurrentUsersProfile: async () => {
            await getCurrentUsersProfile()
        },
    });

    // Config
    const config: ModalPropsType = {
        trigger: props.ui.editProfile,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "editProfile",
        modalClassNames: `${props.isDesiredScreen ? "max-w-full! h-full" : "h-fit"} p-0!`,
        closeOnOverlayClick: isLoading ? false : true,
    };
    return (
        <Modal {...config}>
            <EditProfile
                isLoading={isLoading}
                executeService={executeService}
                validationErrors={extra.validationErrors}
                formDefaultValues={{
                    username: profile?.username || "",
                    bio: profile?.bio || "",
                    profileUrl: profile?.profileUrl || defaultProfileUrl,
                }}
                uiReducers={{
                    closeUi: props.uiReducers?.closeUi || (() => { })
                }}
            />
        </Modal>
    );
};

export default EditProfileModal;