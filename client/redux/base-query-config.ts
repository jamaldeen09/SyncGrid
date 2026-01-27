import { ApiResponse } from "@/lib/types/api";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, clearProfile } from "./slices/user-slice";
import { callToast } from "@/providers/SonnerProvider";

// ===== Base query ===== \\
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
        // ===== Extract tokens from local storage ===== \\
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // ===== Put tokens in headers ===== \\
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        if (refreshToken) headers.set("x-refresh-token", refreshToken);
        return headers;
    },
});


// ===== Base query with re auth upon 401 response ===== \\
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Run the initial request
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401 && (result.error.data as ApiResponse).error?.code === "AUTHENTICATION_ERROR") {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            api.dispatch(clearAuth());
            return result;
        }

        // Attempt to refresh the token
        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "GET",
                headers: { "x-refresh-token": refreshToken },
            },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            const typedResult = (refreshResult.data as ApiResponse).data as { token: string };
            
            // Store new token
            localStorage.setItem("accessToken", typedResult.token);

            // Retry the original session request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // If refresh fails, wipe the state
            api.dispatch(clearAuth());
            api.dispatch(clearProfile());
            callToast.error("Session has expired, please log in to continue");
        }
    }

    return result;
};