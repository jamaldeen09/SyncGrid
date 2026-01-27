import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../base-query-config";
import { ApiResponse } from "@/lib/types/api";
import { EditProfileData } from "@shared/index";


export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPublicProfile: builder.query<ApiResponse, {
            username: string
        }>({
            query: ({ username }) => `/profile/public/${username}`
        }),

        getCurrentUsersProfile: builder.query<ApiResponse, void>({
            query: () => "/profile/private"
        }),

        editProfile: builder.mutation<ApiResponse, EditProfileData>({
            query: ({ bio, username, profileFile }) => {
                const formData = new FormData();

                // Append values
                if (bio) formData.append("bio", bio);
                if (username) formData.append("username", username);
                if (profileFile) formData.append("profileFile", profileFile);

          
                return ({
                    url: `/profile`,
                    method: "PATCH",
                    body: formData,
                })
            } 
        })
    })
});


export const {
  useLazyGetPublicProfileQuery,
  useGetCurrentUsersProfileQuery,
  useEditProfileMutation,
  useLazyGetCurrentUsersProfileQuery,
} = profileApi


