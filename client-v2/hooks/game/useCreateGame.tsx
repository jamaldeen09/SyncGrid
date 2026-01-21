"use client"
import { useCreateGameMutation } from "@/redux/apis/game-api";
import useMutationService from "../useMutationService";
import z from "zod"
import { ApiResponse } from "@/lib/types/api";
import { useUi } from "@/contexts/UiContext";
import { callToast } from "@/providers/SonnerProvider";

// Schema
export const createGameSchema = z.object({
    timeSettingMs: z.number({ error: "Time setting must be a number" }),
    preference: z.enum(["X", "O"], {
        error: "You can only choose to play as X or O"
    })
});

// Hook
const useCreateGame = ()  => {
    const { closeUi } = useUi();

    const createGameService = useMutationService<ApiResponse, typeof createGameSchema.shape>({
        useMutationHook: () => useCreateGameMutation(),
        schema: createGameSchema,
        contextName: "useCreateGame",
        onSuccess: (res) => {
            closeUi("createGame");
            callToast("success", res.message);
        },
    });

    return createGameService;
};

export default useCreateGame;