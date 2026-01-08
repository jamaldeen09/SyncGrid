"use client"
import { ModalComponentProps } from "@/providers/ModalsProvider"
import Modal, { ModalProps } from "../reusable/Modal"
import CreateOrUpdateGame from "../modal-content/CreateOrUpdateGame"

export const CreateGameModal = (props: ModalComponentProps): React.ReactElement | null => {

    // Modals config
    const config: ModalProps = {
        trigger: props.ui.gameCreation,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "gameCreation",
        modalClassNames: `${props.isDesiredScreen ? "max-w-full! h-full" : "h-[95vh]!"} overflow-y-auto! element-scrollable-hidden-scrollbar`,
        closeOnOverlayClick: false
    }

    return (
        <Modal {...config}>
            <CreateOrUpdateGame />
        </Modal>
    )
}

