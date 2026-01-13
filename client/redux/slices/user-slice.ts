import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileType, SessionData } from "@shared/index";

// Auth type
export type AuthType = SessionData & { isAuthenticated: boolean };


// User type / slices initial state type
export interface UserType {
    auth: AuthType;
    profile: ProfileType;
};


// Slice's initial state
const initialState: UserType = {
    auth: {
        username: "",
        userId: "",
        email: "",
        tokenVersion: 0,
        isAuthenticated: false,
    },

    profile: {
        currentWinStreak: 0,
        profileUrl: "",
        createdAt: "",
        updatedAt: "",
        totalGamesWon: 0,
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
                username: "",
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

        setProfile: (state, action: PayloadAction<ProfileType>) => {
            state.profile = {
                ...state.profile,
                ...action.payload
            }
        },

        clearProfile: (state) => {
            state.profile = {
                currentWinStreak: 0,
                profileUrl: "",
                createdAt: "",
                updatedAt: "",
                totalGamesWon: 0,
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


