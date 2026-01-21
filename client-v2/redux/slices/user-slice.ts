import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionData, UiProfileType } from "@shared/index";

// Auth type
export type AuthType = SessionData & { isAuthenticated: boolean };

// User type / slices initial state type
export interface UserType {
    auth: AuthType;
    profile: UiProfileType
};   


// Slice's initial state
const initialState: UserType = {
    auth: {
        userId: "",
        email: "",
        tokenVersion: 0,
        isAuthenticated: false,
    },

    profile: {
        username: "",
        profileUrl: "",
        currentWinStreak: 0,
    }
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{
            tokens: {
                accessToken: string;
                refreshToken: string;
            };
            auth: Omit<AuthType, "isAuthenticated">
        }>) => {
            state.auth = {
                ...action.payload.auth,
                isAuthenticated: true
            }

            // Store tokens in local storage
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", action.payload.tokens.accessToken)
                localStorage.setItem("refreshToken", action.payload.tokens.refreshToken)
            }
        },

        setPartialAuth: (state, action: PayloadAction<Omit<AuthType, "isAuthenticated">>) => {
            state.auth = {
                ...action.payload,
                isAuthenticated: true
            }
        },

        clearAuth: (state) => {
            state.auth = {
                userId: "",
                email: "",
                tokenVersion: 0,
                isAuthenticated: false,
            }

            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        },

        setProfile: (state, action: PayloadAction<UserType["profile"]>) => {
            state.profile = {
                ...state.profile,
                ...action.payload
            }
        },

        clearProfile: (state) => {
            state.profile = {
                profileUrl: "",
                username: "",
                currentWinStreak: 0,
            }
        }
    }
});


export const {
    setAuth,
    setPartialAuth,
    clearAuth,
    setProfile,
    clearProfile
} = userSlice.actions


