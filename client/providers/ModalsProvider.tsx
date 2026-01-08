// "use client"
// import Auth from "@/components/modal-content/auth/Auth";
// import GameCreation from "@/components/modal-content/CreateOrUpdateGame";
// import PlayAsClarification from "@/components/modal-content/PlayAsClarification";
// import Modal, { ModalProps } from "@/components/reusable/Modal";
// import useGetScreenSize from "@/hooks/useGetScreenSize";
// import { useAppSelector } from "@/redux/store";
// import React from "react";
// import FindingOpponent from "@/components/modal-content/FindingOpponent";
// import CreateOrUpdateGame from "@/components/modal-content/CreateOrUpdateGame";
// import { useUi } from "@/contexts/UiContext";



// interface ModalComponentProps {
//     isDesiredScreen?: boolean;
//     ui: UiState
// }

// const ModalsProvider = ({
//     children
// }: { children: React.ReactNode; }): React.ReactElement => {
//     const { ui } = useUi();
//     const [isDesiredScreen] = useGetScreenSize(640);


//     // Global triggers
//     // const {
//     //     gameCreation,
//     //     challengeFriend,
//     //     playAsClarification,
//     //     findingGame,
//     //     auth,
//     //     findingOpponent,
//     //     gameUpdate,
//     // } = useAppSelector((state) => state.triggers.booleanTriggers);

//     // Modals
//     const modals: (Omit<ModalProps & { id: number; content: React.ReactElement }, "children">)[] = [
//         {
//             id: 1,
//             trigger: ui.gameCreation,
//             content: <CreateOrUpdateGame />,
//             animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
//             animationDuration: isDesiredScreen ? 0.2 : 0.1,
//             triggerName: "gameCreation",
//             modalClassNames: `${isDesiredScreen ? "max-w-full! h-full" : "h-[95vh]!"} overflow-y-auto! element-scrollable-hidden-scrollbar`,
//             closeOnOverlayClick: false
//         },
//         {
//             id: 2,
//             trigger: ui.challengeFriend,
//             content: <></>,
//             animation: "scale-into-view",
//             triggerName: "challengeFriend",
//         },

//         {
//             id: 3,
//             trigger: ui.playAsClarification,
//             content: <PlayAsClarification />,
//             animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
//             animationDuration: isDesiredScreen ? 0.2 : 0.1,
//             triggerName: "playAsClarification",
//             closeOnOverlayClick: ui.findingGame ? false : true,
//             modalClassNames: `${isDesiredScreen && "max-w-full! h-full"}`
//         },

//         {
//             id: 4,
//             trigger: ui.auth,
//             content: <Auth />,
//             animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
//             animationDuration: isDesiredScreen ? 0.2 : 0.1,
//             triggerName: "auth",
//             closeOnOverlayClick: true,
//             modalClassNames: `${isDesiredScreen && "max-w-full! h-full"} p-6`
//         },

//         {
//             id: 5,
//             trigger: ui.findingOpponent,
//             content: <FindingOpponent />,
//             animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
//             animationDuration: isDesiredScreen ? 0.2 : 0.1,
//             triggerName: "findingOpponent",
//             closeOnOverlayClick: false,
//             modalClassNames: `${isDesiredScreen && "max-w-full! h-full"} p-6`
//         },

//         {
//             id: 6,
//             trigger: ui.gameUpdate,
//             content: <CreateOrUpdateGame updateMode />,
//             animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
//             animationDuration: isDesiredScreen ? 0.2 : 0.1,
//             triggerName: "gameUpdate",
//             modalClassNames: `${isDesiredScreen ? "max-w-full! h-full" : "h-[95vh]!"} overflow-y-auto! element-scrollable-hidden-scrollbar`,
//             closeOnOverlayClick: false
//         },
//     ];
//     return (
//         <>
//             {modals.map((modal) => (
//                 <Modal
//                     {...modal}
//                     key={modal.id}
//                 >
//                     {modal.content}
//                 </Modal>
//             ))}
//             {children}
//         </>
//     )
// };

// export default ModalsProvider;



"use client"

import { AuthModal } from "@/components/modals/AuthModal";
import { CreateGameModal } from "@/components/modals/CreateGameModal";
import { FindingOpponentModal } from "@/components/modals/FindingOpponentModal";
import FindOpponentConfirmationModal from "@/components/modals/FindOpponentConfirmationModal";
import { PlayAsClarificationModal } from "@/components/modals/PlayAsClarificationModal";
import { UpdateGameModal } from "@/components/modals/UpdateGameModal";
import { UiContextType, UiState, useUi } from "@/contexts/UiContext";
import useGetScreenSize from "@/hooks/useGetScreenSize";
import React from "react";

export interface ModalComponentProps {
    isDesiredScreen?: boolean;
    ui: UiState;
    uiReducers?: Partial<Omit<UiContextType, "ui">>;
}

const ModalsProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    const { ui, openUi } = useUi();
    const [isDesiredScreen] = useGetScreenSize(640);
    return (
        <>
            {/* ===== Auth modal ===== */}
            <AuthModal ui={ui} isDesiredScreen={isDesiredScreen} />

            {/* ===== Create game modal ===== */}
            <CreateGameModal ui={ui} isDesiredScreen={isDesiredScreen} />

            {/* ===== Update game modal ===== */}
            <UpdateGameModal ui={ui} isDesiredScreen={isDesiredScreen} />

            {/* ===== Create game modal ===== */}
            <PlayAsClarificationModal ui={ui} isDesiredScreen={isDesiredScreen} />

            {/* ===== Finding opponent modal ===== */}
            <FindingOpponentModal ui={ui} isDesiredScreen={isDesiredScreen} />

            {/* ===== Find opponent confirmation modal ===== */}
            <FindOpponentConfirmationModal
                ui={ui}
                isDesiredScreen={isDesiredScreen}
                uiReducers={{ openUi }}
            />


            {/* ===== Children ===== */}
            {children}
        </>
    );
};

export default ModalsProvider;