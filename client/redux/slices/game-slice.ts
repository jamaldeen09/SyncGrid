import { PaginationPayload } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameSliceType {
    matchmakingGameId: string;
    gamesFetchResult: PaginationPayload | null;
}

// Slice's initial state
const initialState: GameSliceType = {
    matchmakingGameId: "",
    gamesFetchResult: null,
};


export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setMatchmakingGame: (state, action: PayloadAction<string>) => {
            state.matchmakingGameId = action.payload
        },

        clearMatchmakingGame: (state) => {
            state.matchmakingGameId = ""
        },

        setInitialGamesFetchResult: (state, action: PayloadAction<PaginationPayload>) => {
            state.gamesFetchResult = action.payload;
        },

        setNextGamesFetchResult: (state, action: PayloadAction<PaginationPayload>) => {
            if (!state.gamesFetchResult) return;
            const combinedData = [...action.payload.data, ...state.gamesFetchResult.data]

            const uniqueArrayOfCreatedGames = Array.from(new Map(combinedData.map(item => [item._id, item])).values());
            const fetchResult = { ...action.payload, data: uniqueArrayOfCreatedGames }
            state.gamesFetchResult = fetchResult;
        }
    }
});


export const {
    setMatchmakingGame,
    setInitialGamesFetchResult,
    setNextGamesFetchResult,
} = gameSlice.actions


