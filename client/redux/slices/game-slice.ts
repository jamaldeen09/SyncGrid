import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FinishedGameData, LiveGame } from "@shared/index";

// Slices initial state type
interface GameSliceType {
    finishedGame: FinishedGameData | null;
    liveGame: LiveGame | null;
};

// Slice's initial state
const initialState: GameSliceType = {
    finishedGame: null,
    liveGame: null, 
};

// Actual slice
export const gameSlice = createSlice({
    initialState,
    name: "game",
    reducers: {
        setFinishedGame: (state, action: PayloadAction<FinishedGameData>) => {
            state.finishedGame = action.payload
        },

        setLiveGame: (state, action: PayloadAction<LiveGame>) => {
            state.liveGame = action.payload;
        },

        newMove: (state, action: PayloadAction<LiveGame["moves"]>) => {
            if (state.liveGame) {
                state.liveGame.moves = action.payload;
            }
        }
    }
});

export const {
    setFinishedGame,
    setLiveGame,
    newMove,
} = gameSlice.actions