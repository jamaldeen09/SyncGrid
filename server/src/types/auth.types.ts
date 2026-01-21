import mongoose from "mongoose";

export interface AccessTokenPayload {
    email: string;
    userId: string;  
    tokenVersion: number;
};

export interface RefreshTokenPayload  {
    userId: string;
    tokenVersion: number;
};

export type LoginLean = {
    // ===== Auth ===== \\
    _id: mongoose.Types.ObjectId;
    passwordHash: string;
    email: string;
    tokenVersion: number;


    // ===== Profile ===== \\
    profileUrl: string;
    username: string;
    currentWinStreak: number;
} | null

export type SessionLean = {
    _id: mongoose.Types.ObjectId;
    email: string;
    tokenVersion: number;
} | null

