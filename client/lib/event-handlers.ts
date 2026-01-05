import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import { AppDispatch } from "@/redux/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface OnFoundGameSchema {
    gameId: string;
    router: AppRouterInstance;
    dispatch: AppDispatch
}

/**
 * Handles when a user finds a game after creating one 
 * @param data 
 */
export const onFoundGame = (data: OnFoundGameSchema) => {
    // Disable any lingering modals
    data.dispatch(setBooleanTrigger({ key: "findingOpponent", value: false }));
    data.dispatch(setBooleanTrigger({ key: "gameCreation", value: false }));
    data.dispatch(setBooleanTrigger({ key: "playAsClarification", value: false }));

    // Attach game id to params and route the user
    data.router.push(`/game/${data.gameId}`);
};


