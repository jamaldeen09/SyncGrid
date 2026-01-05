import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Schema of slice's initial state
export interface BooleanTriggers {
    gameCreation: boolean;
    challengeFriend: boolean;
    playAsClarification: boolean;
    findingGame: boolean;
    auth: boolean;
    findingOpponent: boolean;
}


export interface Triggers {
    booleanTriggers: BooleanTriggers
    auth: "login" | "signup"
};


// Slice's initial state
const initialState: Triggers = {
    booleanTriggers: {
        gameCreation: false,
        challengeFriend: false,
        playAsClarification: false,
        findingGame: false,
        auth: false,
        findingOpponent: false,
    },
    auth: "signup",
};


export const triggersSlice = createSlice({
    name: "triggers",
    initialState,
    reducers: {
        setBooleanTrigger: (state, action: PayloadAction<{
            key: keyof BooleanTriggers
            value: boolean
        }>) => {
            const { key, value } = action.payload;
            state.booleanTriggers[key] = value;
        },

        // For auth trigger
        setAuthTrigger: (state, action: PayloadAction<"login" | "signup">) => {
            state.auth = action.payload;
        },
    }
});

export const { setBooleanTrigger, setAuthTrigger } = triggersSlice.actions


