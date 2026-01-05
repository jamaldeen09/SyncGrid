import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../base-query-config";

export interface SignupCredentials {
    username: string;
    password: string;
    email: string;
}

export interface LoginCredentials {
    password: string;
    email: string;
}

// Service 
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
        logout: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),

        getSession: builder.query<ApiResponse, void>({
            query: () => "/auth/session"
        })
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetSessionQuery
} = authApi
