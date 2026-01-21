"use client"
import { ApiResponse } from "@/lib/types/api";
import useMutationService from "../useMutationService";
import z from "zod"
import { authApi, useLogoutMutation } from "@/redux/apis/auth-api";
import { useAppDispatch } from "@/redux/store";
import { clearAuth, clearProfile } from "@/redux/slices/user-slice";
import { callToast } from "@/providers/SonnerProvider";
import { profileApi } from "@/redux/apis/profile-api";
import { gameApi } from "@/redux/apis/game-api";

// Schema
const logoutSchema = z.object({});

const useLogout = () => {
    const dispatch = useAppDispatch();

    // Service
    const logoutService = useMutationService<ApiResponse, typeof logoutSchema.shape>({
        useMutationHook: () => useLogoutMutation(),
        schema: logoutSchema,
        contextName: "useLogout",
        onSuccess: (res) => {
            dispatch(clearAuth());
            dispatch(clearProfile());

            // Clear api states
            dispatch(authApi.util.resetApiState());
            dispatch(profileApi.util.resetApiState());
            dispatch(gameApi.util.resetApiState());

            // Call toast
            callToast.success(res.message)
        },
    });

    return logoutService
};

export default useLogout;