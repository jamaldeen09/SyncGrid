import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Schema of slice's initial state
export interface Triggers {
    gameCreation: boolean;
    challengeFriend: boolean;
};


// Slice's initial state
const initialState: Triggers = {
    gameCreation: false,
    challengeFriend: false
};


export const triggersSlice = createSlice({
    name: "triggers",
    initialState,
    reducers: {
        setTrigger: (state, action: PayloadAction<{ key: keyof Triggers; value: boolean }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
    }
});

export const { setTrigger } = triggersSlice.actions


