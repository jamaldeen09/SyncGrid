import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../base-query-config";
import { Filters } from "@/components/reusable/Filter";


export interface GameSettings {
    visibility: "private" | "public" | "canceled";
    disabled_comments: boolean;
    time_setting_ms: number;
    play_as_preference: "X" | "O"
};

// Service 
export const gameApi = createApi({
    reducerPath: "gameApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createGame: builder.mutation<ApiResponse, GameSettings>({
            query: (body) => ({
                url: "/games",
                method: "POST",
                body,
            })
        }),

        getGames: builder.query<ApiResponse, {
            filters: Filters,
            paginationState: {
                limit: number;
                page: number;
            }
        }>({
            query: (body) => {
                const path = `/games?`;
                const params = new URLSearchParams();

                // Add your filters as query parameters
                if (body.filters.disabled_comments !== undefined) params.set("disabled_comments", body.filters.disabled_comments.toString());
                if (body.filters.play_as) params.set("play_as", body.filters.play_as);
                if (body.filters.status) params.set("status", body.filters.status);
                if (body.filters.time_setting_ms) params.set("time_setting_ms", body.filters.time_setting_ms.toString());
                if (body.filters.visibility) params.set("visibility", body.filters.visibility);
                if (body.filters.sort_order) params.set("sort_order", body.filters.sort_order);


                // Pagination
                if (body.paginationState.page) params.set("page", body.paginationState.page.toString());
                if (body.paginationState.limit) params.set("limit", body.paginationState.limit.toString())

                return `${path}${params.toString()}`
            },
            keepUnusedDataFor: 0
        }),
    }),
});

export const {
    useCreateGameMutation,
    useLazyGetGamesQuery,
} = gameApi;
