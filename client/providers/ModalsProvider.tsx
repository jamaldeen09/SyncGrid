"use client"
import Auth from "@/components/modal-content/Auth";
import GameCreation from "@/components/modal-content/GameCreation";
import PlayAsClarification from "@/components/modal-content/PlayAsClarification";
import Modal, { ModalProps } from "@/components/reusable/Modal";
import useGetScreenSize from "@/hooks/useGetScreenSize";
import { useAppSelector } from "@/redux/store";
import React, { useEffect } from "react";
import FindingOpponent from "@/components/modal-content/FindingOpponent";

const ModalsProvider = ({
    children
}: { children: React.ReactNode; }): React.ReactElement => {
    const [isDesiredScreen] = useGetScreenSize(640);


    // Global triggers
    const {
        gameCreation,
        challengeFriend,
        playAsClarification,
        findingGame,
        auth,
        findingOpponent,
    } = useAppSelector((state) => state.triggers.booleanTriggers);

    // Modals
    const modals: (Omit<ModalProps & { id: number; content: React.ReactElement }, "children">)[] = [
        {
            id: 1,
            trigger: gameCreation,
            content: <GameCreation />,
            animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
            animationDuration: isDesiredScreen ? 0.2 : 0.1,
            triggerName: "gameCreation",
            modalClassNames: `${isDesiredScreen ? "max-w-full! h-full" : "h-[95vh]!"} overflow-y-auto! element-scrollable-hidden-scrollbar`,
            closeOnOverlayClick: false
        },
        {
            id: 2,
            trigger: challengeFriend,
            content: <></>,
            animation: "scale-into-view",
            triggerName: "challengeFriend",
        },

        {
            id: 3,
            trigger: playAsClarification,
            content: <PlayAsClarification />,
            animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
            animationDuration: isDesiredScreen ? 0.2 : 0.1,
            triggerName: "playAsClarification",
            closeOnOverlayClick: findingGame ? false : true,
            modalClassNames: `${isDesiredScreen && "max-w-full! h-full"}`
        },

        {
            id: 4,
            trigger: auth,
            content: <Auth />,
            animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
            animationDuration: isDesiredScreen ? 0.2 : 0.1,
            triggerName: "auth",
            closeOnOverlayClick: true,
            modalClassNames: `${isDesiredScreen && "max-w-full! h-full"} p-6`
        },

        {
            id: 5,
            trigger: findingOpponent,
            content: <FindingOpponent />,
            animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
            animationDuration: isDesiredScreen ? 0.2 : 0.1,
            triggerName: "findingOpponent",
            closeOnOverlayClick: false,
            modalClassNames: `${isDesiredScreen && "max-w-full! h-full"} p-6`
        },
    ];
    return (
        <>
            {modals.map((modal) => (
                <Modal
                    {...modal}
                    key={modal.id}
                >
                    {modal.content}
                </Modal>
            ))}
            {children}
        </>
    )
};

export default ModalsProvider;