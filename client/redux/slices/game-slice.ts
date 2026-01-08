import { GameSettings } from '@/redux/apis/game-api';
import { PaginationPayload } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameSliceType {
    matchmakingGameId: string;
    gamesFetchResult: PaginationPayload | null;
    gameBeingUpdated: (GameSettings & { gameId: string }) | null;
}

// Slice's initial state
const initialState: GameSliceType = {
    matchmakingGameId: "",
    gamesFetchResult: null,
    gameBeingUpdated: null,
};


export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setMatchmakingGameId: (state, action: PayloadAction<string>) => {
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
        },

        setGameBeingUpdated: (state, action: PayloadAction<GameSliceType["gameBeingUpdated"]>) => {
            state.gameBeingUpdated = action.payload;
        }
    }
});


export const {
    setMatchmakingGameId,
    setInitialGamesFetchResult,
    setNextGamesFetchResult,
    setGameBeingUpdated
} = gameSlice.actions


