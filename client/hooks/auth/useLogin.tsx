"use client"
import { useLoginMutation } from "@/redux/apis/auth-api";
import { ApiResponse } from "@/redux/base-query-config";
import { AuthType, setAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import z from "zod"
import { useMutationService } from "../useMutationService";
import { useUi } from "@/contexts/UiContext";


// Schema
const loginSchema = z.object({
  email: z.string().trim().email({ error: "Invalid email address" }),
  password: z.string().trim()
    .min(8, { error: "Password must be at least 8 characters" })
    .max(30, { error: "Password cannot exceed 30 characters" })
    .regex(/(?=.*[a-z])/, { error: "Password must have at least 1 lowercase character" })
    .regex(/[^a-zA-Z0-9<>&;]/, { error: "Password must have at least 1 special character (excluding HTML tags)" })
});


// Hook
const useLogin = () => {
  const dispatch = useAppDispatch();
  const { closeUi } = useUi();

  // Login service
  const loginService = useMutationService<ApiResponse, typeof loginSchema.shape>({
    useMutationHook: () => useLoginMutation(),
    schema: loginSchema,
    contextName: "useLogin",
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
    },
  });

  // Wrapper for extra logic
  const executeService = async (values: z.infer<typeof loginSchema>) => {
    await loginService.executeService(values);
  }

  return {
    ...loginService,
    executeService,
  }
}


export default useLogin;