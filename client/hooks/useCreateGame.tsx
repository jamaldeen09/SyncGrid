"use client"
import { GameSettings, useCreateGameMutation } from "@/redux/apis/game-api";
import { RtkQueryApiServiceType } from "@/redux/base-query-config";
import z from "zod"
import useApiServiceHelper, { ValidationError } from "./useApiServiceHelper";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { callToast } from "@/providers/SonnerProvider";
import { setMatchmakingGame } from "@/redux/slices/game-slice";
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import socket from "@/lib/socket";


const useCreateGame = (settings: GameSettings, setSettings: React.Dispatch<React.SetStateAction<GameSettings>>): RtkQueryApiServiceType<GameSettings, { validationErrors: ValidationError[] }> => {
    const dispatch = useAppDispatch();
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const { extractValidationErrors, extractErrorMessage } = useApiServiceHelper();

    // Game creation api service
    const [createGame, {
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }] = useCreateGameMutation();

    /**
       * Executes the game creation operation and makes an http request to the backend
       * @param values 
       */
    const executeService = async (values: GameSettings) => {
        if (!socket.connected) {
            callToast("error", "You are currently offline")
            return;
        }
        try {
            await createGame(values)
        } catch (err) {
            console.error(`===== Game creation error =====\nHook: useCreateGame\n${err}`);
            callToast("error", "An unexpected error occured while trying to create your game, please try again shortly");
        }
    }

    // Handles successful http requests after game creation operation
    const onSuccess = () => {
        if (!isSuccess) return;
        const typedData = data.data as { 
            gameId: string;
            visibility: "private" | "public";
        };

        // Store game settings in a global state to use in other components
        dispatch(setMatchmakingGame(typedData.gameId));

        // Reset the local state
        setSettings({
            time_setting_ms: 30000,
            visibility: "private",
            disabled_comments: false,
            play_as_preference: "X"
        });

        // Disable game creation modal
        {typedData.visibility === "private" && (dispatch(setBooleanTrigger({ key: "gameCreation", value: false })))}

        // Enable game search model
        {typedData.visibility === "public" && (dispatch(setBooleanTrigger({ key: "findingOpponent", value: true })))}

        // Refetch games
    }

    // Handles failed http requests after game creation operation
    const onFailure = () => {
        if (!error || !isError || !("data" in error)) return;
        setValidationErrors(extractValidationErrors(error));
        callToast("error", extractErrorMessage(error));
    }

    // Use effect to track successfull and error cases after game creation operation
    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess && isComponentMounted) onSuccess()
        if (isError && error && "data" in error && isComponentMounted) onFailure()

        return () => {
            isComponentMounted = false
        }
    }, [isSuccess, isError, error, data, callToast]);

    return {
        executeService,
        error,
        isError,
        isLoading,
        data,
        isSuccess,
        extra: { validationErrors },
    }
};

export default useCreateGame;