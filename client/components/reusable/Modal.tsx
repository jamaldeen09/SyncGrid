"use client"
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"
import { BooleanTriggers, setBooleanTrigger, Triggers } from "@/redux/slices/triggers-slice";
import { useAppDispatch } from "@/redux/store";

export type Animation = "scale-into-view" | "top-into-view" | "bottom-into-view" | "left-into-view" | "right-into-view"

export interface ModalProps {
    trigger: boolean;
    animation: Animation;
    overlayClassNames?: string;
    closeOnOverlayClick?: boolean;
    modalClassNames?: string;
    children?: React.ReactNode;
    triggerName: keyof BooleanTriggers;
    animationDuration?: number;
};


export interface GetAnimationReturnType {
    initial: {
        x?: number;
        y?: number;
        scale?: number;
        opacity?: number;
    };
    animate: GetAnimationReturnType["initial"];
    exit: GetAnimationReturnType["initial"];
    transition: { duration: number };
};

export const getAnimation = (animation: Animation, duration?: number): GetAnimationReturnType => {
    const absoluteDuration = duration || 0.1;

    // ===== Conditions ===== \\
    let absoluteAnimation: Omit<GetAnimationReturnType, "exit" | "transition"> = {
        initial: { scale: 0.9 },
        animate: { scale: 1 },
    };

    if (animation === "scale-into-view") {
        absoluteAnimation = {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
        }
    }

    if (animation === "top-into-view") {
        absoluteAnimation = {
            initial: { y: -4, opacity: 0 },
            animate: { y: 0, opacity: 1 },
        }
    }


    if (animation === "bottom-into-view") {
        absoluteAnimation = {
            initial: { y: 4, opacity: 0 },
            animate: { y: 0, opacity: 1 },
        }
    }


    if (animation === "right-into-view") {
        absoluteAnimation = {
            initial: { x: -4, opacity: 0 },
            animate: { x: 0, opacity: 1},
        }
    }

    if (animation === "left-into-view") {
        absoluteAnimation = {
            initial: { x: 4, opacity: 0 },
            animate: { x: 0, opacity: 1 },
        }
    }

    return {
        ...absoluteAnimation,
        transition: { duration: absoluteDuration },
        exit: absoluteAnimation.initial
    }
}


export const ModalOverlay = ({ children: modalContent, className, shouldCloseOnClick = true, onClose }: {
    children: React.ReactNode;
    className?: string;
    shouldCloseOnClick?: boolean;
    onClose?: () => void;
}) => {
    return (
        <motion.div
            onClick={() => {
                if (!shouldCloseOnClick || !onClose) return;
                return onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`fixed inset-0 supports-backdrop-filter:backdrop-blur-xs top-0 bg-black/10 z-100 flex justify-center items-center ${className}`}
        >
            {modalContent}
        </motion.div>
    )
}; 


export const ModalContent = ({
    animation,
    children,
    className,
    animationDuration,
}: { animation: Animation; children: React.ReactNode; className?: string; animationDuration?: number }) => {
    const {
        initial,
        animate,
        exit,
        transition
    } = getAnimation(animation, animationDuration);
    return (
        <motion.div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            className={`max-w-xs sm:max-w-sm md:max-w-lg ring-foreground/10 bg-card text-card-foreground gap-4 overflow-hidden rounded-none p-4 text-xs/relaxed ring-1 w-full h-fit ${className}`}
        >
            {children}
        </motion.div>
    )
};


export const Modal = (props: ModalProps): React.ReactElement => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        // Quit scrolling when trigger gets called
        if (props.trigger) document.body.style.overflow = "hidden"
        else document.body.style.overflow = "visible"

        // Clean up function
        return () => {
            document.body.style.overflow = ""
        }
    }, [props.trigger]);

    // Closes the modal
    const onClose = () => dispatch(setBooleanTrigger({ key: props.triggerName, value: false }));
    return (
        <AnimatePresence>
            {props.trigger && (
                <ModalOverlay shouldCloseOnClick={props.closeOnOverlayClick} onClose={onClose} className={props.overlayClassNames}>
                    <ModalContent animationDuration={props.animationDuration} className={props.modalClassNames} animation={props.animation}>
                        {props.children}
                    </ModalContent>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
};

export default Modal;