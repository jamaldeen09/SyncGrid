"use client"
import { callToast } from "@/providers/SonnerProvider";
import { useLoginMutation } from "@/redux/apis/auth-api";
import { RtkQueryApiServiceType } from "@/redux/base-query-config";
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import { AuthType, setAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import z from "zod"
import useApiServiceHelper, { ValidationError } from "./useApiServiceHelper";


type LoginSchemaType = z.ZodObject<{
  email: z.ZodString;
  password: z.ZodString;
}, z.core.$strip>;

type ExecuteServiceType = (values: z.infer<LoginSchemaType>) => Promise<void>

const useLogin = (): RtkQueryApiServiceType<ExecuteServiceType, { 
  validationErrors: ValidationError[];
  schema: LoginSchemaType;
}> => {
  const dispatch = useAppDispatch();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { extractValidationErrors, extractErrorMessage } = useApiServiceHelper();

  // Schema
  const loginSchema: LoginSchemaType = z.object({
    email: z.string().trim().email({ error: "Invalid email address" }),
    password: z.string().trim()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(30, { error: "Password cannot exceed 30 characters" })
      .regex(/(?=.*[a-z])/, { error: "Password must have at least 1 lowercase character" })
      .regex(/[^a-zA-Z0-9<>&;]/, { error: "Password must have at least 1 special character (excluding HTML tags)" })
  });

  // Login api service
  const [login, {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  }] = useLoginMutation();

  /**
   * Executes the login operation and makes an http request to the backend
   * @param values 
   */
  const executeService = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values)
    } catch (err) {
      console.error(`===== Error occured during login =====\nHook: useLogin\n${err}`);
      callToast("error", "An unexpected error occured while trying to log you into your account, please try again shortly");
    }
  }

  // Handles successful http requests after login operation
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
    dispatch(setBooleanTrigger({ key: "auth", value: false }));
  }

  // Handles failed http requests after login operation
  const onFailure = () => {
    if (!error || !isError || !("data" in error)) return;
    setValidationErrors(extractValidationErrors(error));
    callToast("error", extractErrorMessage(error));
  }


  // Use effect to track successfull and error cases after login operation
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
      schema: loginSchema 
    },
  }
};

export default useLogin;