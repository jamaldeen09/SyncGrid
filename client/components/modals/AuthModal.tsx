"use client"
import { ModalComponentProps } from "@/providers/ModalsProvider";
import Modal, { ModalProps } from "../reusable/Modal";
import Login from "../modal-content/auth/Login";
import Signup from "../modal-content/auth/Signup";
import { useAuth } from "@/contexts/AuthContext";

export const AuthModal = (props: ModalComponentProps) => {
    const { auth } = useAuth();

    // Modals config
    const config: ModalProps = {
        trigger: props.ui.auth,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "auth",
        closeOnOverlayClick: false,
        modalClassNames: `${props.isDesiredScreen && "max-w-full! h-full"} p-6`
    }

    const renderAuthComponent = () => {
        if (auth === "login") return <Login />

        return <Signup />
    }

    return (
        <Modal {...config}>
            {renderAuthComponent()}
        </Modal>
    )
}