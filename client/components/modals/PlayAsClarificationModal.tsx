import React from "react";
import PlayAsClarification from "../modal-content/PlayAsClarification";
import Modal, { ModalProps } from "../reusable/Modal";
import { ModalComponentProps } from "@/providers/ModalsProvider";



export const PlayAsClarificationModal = (props: ModalComponentProps): React.ReactElement | null => {

    // Modal's config
    const config: ModalProps = {
        trigger: props.ui.playAsClarification,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "playAsClarification",
        modalClassNames: `${props.isDesiredScreen && "max-w-full! h-full"}`,
        closeOnOverlayClick: true
    }

    return (
        <Modal {...config} >
            <PlayAsClarification />
        </Modal>
    )
};




