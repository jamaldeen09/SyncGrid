"use client"
import { ApiResponse } from "@/redux/base-query-config";
import z from "zod";
import { useAppDispatch } from "@/redux/store";
import { useSignupMutation } from "@/redux/apis/auth-api";
import { AuthType, setAuth } from "@/redux/slices/user-slice";
import { useMutationService } from "../useMutationService";
import { useUi } from "@/contexts/UiContext";


// Schema
const signupSchema = z.object({
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
            const typedData = res.data as {
                tokens: {
                    accessToken: string;
                    refreshToken: string;
                },
                auth: Omit<AuthType, "isAuthenticated">
            };
    
            dispatch(setAuth(typedData));
            closeUi("auth")
        }
    });

    const executeService = async (values: z.infer<typeof signupSchema>) => {
        await signupService.executeService(values);
    }

    return {
        ...signupService,
        executeService,
    }
}

export default useSignup;