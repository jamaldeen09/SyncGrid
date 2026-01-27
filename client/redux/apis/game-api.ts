import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../base-query-config";
import { ApiResponse } from "@/lib/types/api";
import { GameSettings, GetGamesData, MinimalGameSettings } from "@shared/index";


// Api service
export const gameApi = createApi({
    reducerPath: "gameApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createGame: builder.mutation<ApiResponse, MinimalGameSettings>({
            query: (body) => ({
                url: "/games",
                method: "POST",
                body,
            })
        }),

        updateGame: builder.mutation<ApiResponse, Partial<GameSettings>>({
            query: (body) => ({
                url: "/games",
                method: "PATCH",
                body,
            })
        }),

        getGames: builder.query<ApiResponse, GetGamesData & { userId: string }>({
            query: (body) => {
                const url = `/games/${body.userId}?`
                const urlSearchParams = new URLSearchParams();

                // ===== Limit ===== \\
                if (body.limit) 
                    urlSearchParams.append(`limit`, body.limit.toString());

                // ===== Page ===== \\
                if (body.page)
                    urlSearchParams.append("page", body.page.toString())


                // ===== Preference ===== \\
                if (body.preference)
                    urlSearchParams.append("preference", body.preference);

                // ===== Sort order ===== \\
                if (body.sortOrder)
                    urlSearchParams.append("sortOrder", body.sortOrder)

                // ===== Visibility ===== \\
                if (body.visibility)
                    urlSearchParams.append("visibility", body.visibility);

                // ===== Metric ===== \\
                if (body.metric)
                    urlSearchParams.append("metric", body.metric);

                return `${url}${urlSearchParams.toString()}`
            }
        }),

        getGame: builder.query<ApiResponse, { gameId: string; gameType: "live-game" | "finished-game" }>({
            query: ({ gameId, gameType }) => `/game/${gameId}?gameType=${gameType}`
        }),

        getBannerLiveGameId: builder.query<ApiResponse, void>({
            query: () => `/banner/game`
        })
    }),
});

export const {
    useCreateGameMutation,
    useUpdateGameMutation,
    useLazyGetGamesQuery,
    useLazyGetGameQuery,
    useLazyGetBannerLiveGameIdQuery,
} = gameApi
