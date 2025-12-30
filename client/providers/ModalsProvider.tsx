"use client"
import Modal, { ModalProps } from "@/components/reusable/Modal";
import { useAppSelector } from "@/redux/store";
import React from "react";

const ModalsProvider = ({
    children
}: { children: React.ReactNode; }): React.ReactElement => {
    const { gameCreation, challengeFriend } = useAppSelector((state) => state.triggers);

    const modals: (Omit<ModalProps & { id: number; content: React.ReactElement }, "children">)[] = [
            {
                id: 1,
                trigger: gameCreation,
                content: <></>,
                animation: "scale-into-view",
                triggerName: "gameCreation",
            },
            {
                id: 2,
                trigger: challengeFriend,
                content: <></>,
                animation: "scale-into-view",
                triggerName: "challengeFriend",
            },
        ];
    return (
        <>
            {modals.map((modal) => (
                <Modal
                    triggerName={modal.triggerName}
                    trigger={modal.trigger}
                    key={modal.id}
                    animation={modal.animation}
                >
                    {modal.content}
                </Modal>
            ))}
            {children}
        </>
    )
};

export default ModalsProvider;