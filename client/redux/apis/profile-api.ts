import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../base-query-config";


// Service 
export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getProfile: builder.query<ApiResponse, void>({
            query: () => "/profile/me"
        })
    }),
});

export const { useGetProfileQuery } = profileApi;
