"use client"
import AuthModal from "@/components/modals/AuthModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { UiContextType, UiState, useUi } from "@/contexts/UiContext";
import useGetScreenSize from "@/hooks/useGetScreenSize";
import React from "react";

// Component Props
export interface ModalComponentPropsType {
    isDesiredScreen?: boolean;
    ui: UiState;
    uiReducers?: Partial<Omit<UiContextType, "ui">>;
}

const ModalsProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    // Hooks
    const { ui, openUi, closeUi } = useUi();
    const [isDesiredScreen] = useGetScreenSize(640);
    return (
        <>
            {/* ===== Auth modal ===== */}
            <AuthModal
                ui={ui}
                isDesiredScreen={isDesiredScreen}
                uiReducers={{ openUi, closeUi }}
            />

            {/* ===== Edit profile modal ===== */}
            <EditProfileModal 
              ui={ui}
              isDesiredScreen={isDesiredScreen}
              uiReducers={{ closeUi }}
            />

            {/* ===== Children ===== */}
            {children}
        </>
    );
};

export default ModalsProvider;