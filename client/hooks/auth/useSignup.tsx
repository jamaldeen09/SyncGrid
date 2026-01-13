"use client"
import z from "zod";
import { useAppDispatch } from "@/redux/store";
import { useSignupMutation } from "@/redux/apis/auth-api";
import { useUi } from "@/contexts/UiContext";
import { ApiResponse } from "@/lib/types/api";
import useMutationService from "../useMutationService";
import { ProfileType, SessionData } from "@shared/index";
import { setAuth, setProfile } from "@/redux/slices/user-slice";

// Schema type
export type SignupSchemaType = z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;

// Schema
export const signupSchema = z.object({
    username: z.string().trim()
        .min(1, { error: "Username must be at least 1 character" })
        .max(39, { error: "Username cannot exceed 39 characters" })
        .regex(/^[a-zA-Z0-9-]+$/, { error: "Must only contain letters, numbers, or hyphens" })
        .regex(/^(?!-)/, { error: "Username cannot begin with a hyphen" })
        .regex(/(?<!-)$/, { error: "Username cannot end with a hyphen" })
        .regex(/(?!.*--.*)/, { error: "Username cannot have consecutive hypens" }),

    email: z.string().trim().email({ error: "Invalid email address" }),
    password: z.string().trim()
        // .min(8, { error: "Password must be at least 8 characters" })
        .max(30, { error: "Password cannot exceed 30 characters" })
        .regex(/(?=.*[a-z])/, { error: "Password must have at least 1 lowercase character" })
        .regex(/[^a-zA-Z0-9<>&;]/, { error: "Password must have at least 1 special character (excluding HTML tags)" })
});


// Hook
const useSignup = () => {
    const dispatch = useAppDispatch();
    const { closeUi } = useUi();

    // Signup service
    const signupService = useMutationService<ApiResponse, typeof signupSchema.shape>({
        useMutationHook: () => useSignupMutation(),
        schema: signupSchema,
        contextName: "useSignup",
        onSuccess: (res) => {
            // Typed data
            const data = res.data as {
                tokens: { accessToken: string; refreshToken: string },
                auth: SessionData,
                profile: ProfileType,
            };

            dispatch(setAuth(data));
            dispatch(setProfile(data.profile))
            closeUi("auth");
        }
    });


    return signupService
}

export default useSignup;