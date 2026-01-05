"use client"
import { RtkQueryApiServiceType } from "@/redux/base-query-config";
import z from "zod";
import useApiServiceHelper, { ValidationError } from "./useApiServiceHelper";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSignupMutation } from "@/redux/apis/auth-api";
import { callToast } from "@/providers/SonnerProvider";
import { AuthType, setAuth } from "@/redux/slices/user-slice";
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";

type SignupSchemaType = z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;

type ExecuteServiceType = (values: z.infer<SignupSchemaType>) => Promise<void>;

const useSignup = (): RtkQueryApiServiceType<ExecuteServiceType, {
    validationErrors: ValidationError[];
    schema: SignupSchemaType;
}> => {
    const dispatch = useAppDispatch();
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const { extractValidationErrors, extractErrorMessage } = useApiServiceHelper();

    // Schema
    const signupSchema: SignupSchemaType = z.object({
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

    // Signup api service
    const [signup, {
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }] = useSignupMutation();


    /**
     * Executes the signup operation and makes an http request to the backend
     * @param values 
     */
    const executeService = async (values: z.infer<typeof signupSchema>) => {
        try {
            await signup(values);
        } catch (err) {
            console.error(`===== Error occured during signup =====\nFile: useSignup\n${err}`);
            callToast("error", "An unexpected error occured during the registration process, please try again shortly");
        }
    }


    // Handles successful http requests after signup operation
    const onSuccess = () => {
        if (!isSuccess) return;
        const typedData = data.data as {
            tokens: {
                accessToken: string;
                refreshToken: string;
            },
            auth: Omit<AuthType, "isAuthenticated">
        };

        dispatch(setAuth(typedData));
        dispatch(setBooleanTrigger({ key: "auth", value: false }))
    }

    // Handles failed http requests after signup operation
    const onFailure = () => {
        if (!error || !isError || !("data" in error)) return;
        setValidationErrors(extractValidationErrors(error));
        callToast("error", extractErrorMessage(error));
    }

    // Use effect to track successfull and error cases after signup operation
    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess && isComponentMounted) onSuccess();
        if (isError && error && "data" in error && isComponentMounted) onFailure();

        return () => {
            isComponentMounted = false
        }
    }, [isError, error, data, isSuccess, dispatch, callToast]);

    return {
        executeService,
        error,
        isError,
        isLoading,
        data,
        isSuccess,
        extra: {
            validationErrors,
            schema: signupSchema,
        },
    }
};

export default useSignup;