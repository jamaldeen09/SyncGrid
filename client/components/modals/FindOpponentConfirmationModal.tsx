import { ModalComponentProps } from "@/providers/ModalsProvider";
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UiContextType } from "@/contexts/UiContext";

const FindOpponentConfirmationModal = (props: ModalComponentProps): React.ReactElement | null => {
    const onOpenChange = () => {
        if (!props.uiReducers) return;

        const absoluteUiReducersObj = props.uiReducers as Omit<UiContextType, "ui">;
        absoluteUiReducersObj.openUi("findOpponentConfirmation");
    }

    return (
        <AlertDialog open={props.ui.findOpponentConfirmation} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Game Created Successfully!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your public game is now live. Would you like to enter the matchmaking queue now to find an opponent?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        No
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                    }}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default FindOpponentConfirmationModal;