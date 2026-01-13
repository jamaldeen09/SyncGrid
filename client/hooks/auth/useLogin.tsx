"use client"
import { setAuth, setProfile } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import z from "zod"
import { useUi } from "@/contexts/UiContext";
import useMutationService from "../useMutationService";
import { ApiResponse } from "@/lib/types/api";
import { useLoginMutation } from "@/redux/apis/auth-api";
import { ProfileType, SessionData } from "@shared/index";

// Schema type
export type LoginSchemaType = z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;

// Schema
export const loginSchema = z.object({
    email: z.string().trim().email({ error: "Invalid email address" }),
    password: z.string().trim()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(30, { error: "Password cannot exceed 30 characters" })
        .regex(/(?=.*[a-z])/, { error: "Password must have at least 1 lowercase character" })
        .regex(/[^a-zA-Z0-9<>&;]/, { error: "Password must have at least 1 special character (excluding HTML tags)" })
});


// Hook
const useLogin = () => {
    // Hooks
    const dispatch = useAppDispatch();
    const { closeUi } = useUi();

    // Login service
    const loginService = useMutationService<ApiResponse, typeof loginSchema.shape>({
        useMutationHook: () => useLoginMutation(),
        schema: loginSchema,
        contextName: "useLogin",
        onSuccess: async (res) => {
            // Typed data
            const data = res.data as {
                tokens: { accessToken: string; refreshToken: string }, 
                auth: SessionData,
                profile: ProfileType,
            };

            dispatch(setAuth(data));
            dispatch(setProfile(data.profile))
            closeUi("auth");
        },
    });

    return loginService
}


export default useLogin;