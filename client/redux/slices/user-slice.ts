import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Schema of slice's initial state
export interface AuthType {
    username: string;
    userId: string;
    email: string;
    isAuthenticated: boolean;
}

export interface ProfileType {
    current_win_streak: number;
    profile_url: string;
    status: "offline" | "online";
    created_at: string;
    updated_at: string;
}


export type ProfilePayload = Omit<ProfileType, "status">;

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
        isAuthenticated: false,
    },

    profile: {
        current_win_streak: 0,
        profile_url: "",
        status: "offline",
        created_at: "",
        updated_at: "",
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
            state.auth = { ...action.payload.auth, isAuthenticated: true }

            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", action.payload.tokens.accessToken)
                localStorage.setItem("refreshToken", action.payload.tokens.refreshToken)
            }
        },

        setPartialAuth: (state, action: PayloadAction<Omit<AuthType, "isAuthenticated">>) => {
            state.auth = { ...action.payload, isAuthenticated: true }
        },

        clearAuth: (state) => {
            state.auth = {
                username: "",
                userId: "",
                email: "",
                isAuthenticated: false,
            }
        },

        setProfile: (state, action: PayloadAction<ProfilePayload>) => {
            state.profile = { ...state.profile, ...action.payload }
        },

        clearProfile: (state) => {
            state.profile = {
                current_win_streak: 0,
                profile_url: "",
                status: "offline",
                created_at: "",
                updated_at: "",
            }
        }
    }
});


export const {
    setAuth,
    setPartialAuth,
    clearAuth,
    setProfile
} = userSlice.actions


