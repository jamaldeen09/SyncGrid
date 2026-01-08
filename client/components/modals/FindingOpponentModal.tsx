"use client"
import { ModalComponentProps } from "@/providers/ModalsProvider";
import Modal, { ModalProps } from "../reusable/Modal";
import FindingOpponent from "../modal-content/FindingOpponent";

export const FindingOpponentModal = (props: ModalComponentProps) => {
    const config: ModalProps = {
        trigger: props.ui.findingOpponent,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "findingOpponent",
        closeOnOverlayClick: false,
        modalClassNames: `${props.isDesiredScreen && "max-w-full! h-full"} p-6`
    }

    return (
        <Modal {...config}>
            <FindingOpponent />
        </Modal>
    )
}
