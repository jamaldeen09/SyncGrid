import { ModalComponentPropsType } from "@/providers/ModalsProvider";
import React from "react";
import Modal, { ModalPropsType } from "../reusable/Modal";
import ManipulateGame from "../reusable/game/ManipulateGame";

const CreateGameModal = (props: ModalComponentPropsType): React.ReactElement => {

    // Config
    const config: ModalPropsType = {
        trigger: props.ui.createGame,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "createGame",
        modalClassNames: `${props.isDesiredScreen ? "max-w-full! h-full" : "h-fit!"}`,
        closeOnOverlayClick: false
    }

    return (
        <Modal {...config}>
            <ManipulateGame 
               manipulationType="create"
               closeUi={props.uiReducers?.closeUi || (() => {})}
               currentGameState={{
                timeSettingMs: 30000,
                preference: "X",
               }}
            />
        </Modal>
    )
};

export default CreateGameModal;