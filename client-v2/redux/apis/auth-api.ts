import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../base-query-config";
import { ApiResponse } from "@/lib/types/api";
import { LoginCredentials, SignupCredentials } from "@shared/index";


// Api service
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signup: builder.mutation<ApiResponse, SignupCredentials>({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            })
        }),
        login: builder.mutation<ApiResponse, LoginCredentials>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            })
        }),

        logout: builder.mutation<ApiResponse, {}>({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),

        getSession: builder.query<ApiResponse, void>({
            query: () => "/auth/session"
        }),

        refresh: builder.query<ApiResponse, void>({
            query: () => `/auth/refresh`
        })
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useLazyGetSessionQuery,
    useLazyRefreshQuery,
} = authApi
