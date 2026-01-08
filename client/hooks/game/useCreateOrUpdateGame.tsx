"use client"
import { useCreateGameMutation, useUpdateGameMutation } from "@/redux/apis/game-api";
import { useMutationService } from "../useMutationService";
import { ApiResponse } from "@/redux/base-query-config";
import { callToast } from "@/providers/SonnerProvider";
import { useGameFetch } from "@/contexts/GameFetchContext";
import socket from "@/lib/socket";
import { useAppDispatch } from "@/redux/store";
import z from "zod";
import { setMatchmakingGameId } from "@/redux/slices/game-slice";
import { useUi } from "@/contexts/UiContext";

// Schemas
export const gameSettingsSchema = z.object({
    time_setting_ms: z.number({ error: "Time setting must be a number" }),
    visibility: z.enum(
        ["private", "public", "canceled"],
        { error: "Visibility can only be private, public or canceled" }
    ),
    disabled_comments: z.boolean(),
    play_as_preference: z.enum(["X", "O"], { error: "You can only choose to play as X or O" })
});

export const gameUpdateSchema = gameSettingsSchema.extend({
    gameId: z.string().min(24, "Invalid Game ID").max(24, "Invalid Game ID")
});

// Types 
interface UseCreateOrUpdateGameArgs {
    action: "update" | "create";
    setSettings: React.Dispatch<React.SetStateAction<z.infer<typeof gameSettingsSchema>>>;
}

const useCreateOrUpdateGame = (args: UseCreateOrUpdateGameArgs) => {
    const dispatch = useAppDispatch();
    const {
        filterHelpers: { manipulateFilters },
        paginationStateHelpers: { manipulatePaginationState }
    } = useGameFetch();

    const { closeUi, openUi } = useUi();

    // Common Success Logic
    const handleSuccessfulGameCreation = (response: ApiResponse) => {
        const typedData = response.data as {
            gameId: string;
            visibility: "private" | "public";
        };

        // Store the game's id for later use if user wishes to find an opponent
        dispatch(
            setMatchmakingGameId(
                typedData.gameId
            )
        );

        // Reset local settings state
        args.setSettings({
            time_setting_ms: 30000,
            visibility: "private",
            disabled_comments: false,
            play_as_preference: "X"
        });

        closeUi("gameCreation")
        if (typedData.visibility === "public") {
            openUi("findOpponentConfirmation")
        }

        // Reset filters and page
        manipulateFilters("clear");
        manipulatePaginationState(1);
        callToast("success", response.message);
    };

    const handleSuccessfulGameUpdate = (response: ApiResponse) => {
        closeUi("gameUpdate")

        // Reset filters and page
        manipulateFilters("clear");
        manipulatePaginationState(1);
        callToast("success", response.message);
    }

    // Initialize both services
    const createService = useMutationService<ApiResponse, typeof gameSettingsSchema.shape>({
        useMutationHook: () => useCreateGameMutation(),
        schema: gameSettingsSchema,
        contextName: "useCreateGame",
        onSuccess: (res) => handleSuccessfulGameCreation(res),
    });

    const updateService = useMutationService<ApiResponse, typeof gameUpdateSchema.shape>({
        useMutationHook: () => useUpdateGameMutation(),
        schema: gameUpdateSchema,
        contextName: "useUpdateGame",
        onSuccess: (res) => handleSuccessfulGameUpdate(res)
    });

    // 3. Unified Executor
    const executeService = async (values: z.infer<typeof gameSettingsSchema> | z.infer<typeof gameUpdateSchema>) => {
        if (!socket.connected) {
            callToast("error", "You are currently offline");
            return;
        }

        // Determine which service to call based on the action prop
        if (args.action === "update") {
            await updateService.executeService(values as z.infer<typeof gameUpdateSchema>);
        } else {
            await createService.executeService(values as z.infer<typeof gameSettingsSchema>);
        }
    };

    // Expose the active state to the UI
    // This ensures isLoading, isError, etc., reflect the action currently in use
    const activeService = args.action === "update" ? updateService : createService;

    return {
        ...activeService,
        executeService,
    };
};

export default useCreateOrUpdateGame;