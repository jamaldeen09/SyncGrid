"use client"
import { useUi } from "@/contexts/UiContext";
import z from "zod"
import useMutationService from "../useMutationService";
import { ApiResponse } from "@/lib/types/api";
import { useUpdateGameMutation } from "@/redux/apis/game-api";
import { callToast } from "@/providers/SonnerProvider";

// Schema
export const updateGameSchema = z.object({
    visibility: z.enum(["public", "canceled"], {
        error: "Visibility can only be public or canceled"
    }).optional(),
    timeSettingMs: z.number({ error: "Time setting must be a number" }).optional(),
    preference: z.enum(["X", "O"], {
        error: "You can only choose to play as X or O"
    }).optional()
})

// Hook
export const useUpdateGame = () => {
    const { closeUi } = useUi();

    const updateGameService = useMutationService<ApiResponse, typeof updateGameSchema.shape>({
        useMutationHook: () => useUpdateGameMutation(),
        schema: updateGameSchema,
        contextName: "useUpdateGame",
        onSuccess: (res) => {
            closeUi("updateGame");
            callToast("success", res.message);
        },
    });

    return updateGameService;
};

export default useUpdateGame;