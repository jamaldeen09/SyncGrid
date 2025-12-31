"use client"
import GameCreation from "@/components/modal-content/GameCreation";
import PlayAsClarification from "@/components/modal-content/PlayAsClarification";
import Modal, { ModalProps } from "@/components/reusable/Modal";
import useGetScreenSize from "@/hooks/useGetScreenSize";
import { useAppSelector } from "@/redux/store";
import React from "react";

const ModalsProvider = ({
    children
}: { children: React.ReactNode; }): React.ReactElement => {
    const [isDesiredScreen] = useGetScreenSize(640);

    // Global triggers
    const {
        gameCreation,
        challengeFriend,
        playAsClarification,
        findingMatch,
    } = useAppSelector((state) => state.triggers);

    // Modals
    const modals: (Omit<ModalProps & { id: number; content: React.ReactElement }, "children">)[] = [
        {
            id: 1,
            trigger: gameCreation,
            content: <GameCreation />,
            animation: isDesiredScreen ? "bottom-into-view" : "scale-into-view",
            animationDuration: isDesiredScreen ? 0.2 : 0.1,
            triggerName: "gameCreation",
            modalClassNames: `${isDesiredScreen && "max-w-full! h-full"}`
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
            closeOnOverlayClick: findingMatch ? false : true,
            modalClassNames: `${isDesiredScreen && "max-w-full! h-full"}`
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