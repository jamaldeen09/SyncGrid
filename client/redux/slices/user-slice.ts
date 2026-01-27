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
        bio: "",
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

        setProfile: (state, action: PayloadAction<Partial<UserType["profile"]>>) => {
            // ===== Update the users profile conditionally ===== \\
            if (action.payload.bio) state.profile.bio = action.payload.bio;
            if (action.payload.profileUrl) state.profile.profileUrl = action.payload.profileUrl
            if (action.payload.username) state.profile.username = action.payload.username
        },

        clearProfile: (state) => {
            state.profile = {
                profileUrl: "",
                username: "",
                bio: ""
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


