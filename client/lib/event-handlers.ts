
import { UiContextType } from "@/contexts/UiContext";
import { AppDispatch } from "@/redux/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface OnFoundGameSchema {
    gameId: string;
    router: AppRouterInstance;
    dispatch: AppDispatch;
    closeUi: UiContextType["closeUi"];
}

/**
 * Handles when a user finds a game after creating one 
 * @param data 
 */
export const onFoundGame = (data: OnFoundGameSchema) => {
    // Disable any lingering modals
    data.closeUi("findingOpponent");
    data.closeUi("gameCreation");
    data.closeUi("playAsClarification");

    // Attach game id to params and route the user
    data.router.push(`/game/${data.gameId}`);
};


