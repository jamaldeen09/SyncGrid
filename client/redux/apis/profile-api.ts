import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../base-query-config";
import { ApiResponse } from "@/lib/types/api";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCurrentUserProfile: builder.query<ApiResponse, void>({
            query: () => "/profile/me"
        }),

        getOtherUserProfile: builder.query<ApiResponse, {
            userId: string
        }>({
            query: ({ userId }) => `/profile/${userId}`
        })
    })
});


export const {
    useGetCurrentUserProfileQuery,
    useGetOtherUserProfileQuery,
} = profileApi


