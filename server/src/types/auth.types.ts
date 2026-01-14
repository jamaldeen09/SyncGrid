import jwt from "jsonwebtoken"
import mongoose from "mongoose";


export interface AccessTokenPayload extends jwt.JwtPayload {
    userId: string;
    email: string;
    username: string;
    tokenVersion: number;
};

export interface RefreshTokenPayload extends jwt.JwtPayload {
    userId: string;
    tokenVersion: number;
};

export type LoginLean = {
    // ===== Auth ===== \\
    _id: mongoose.Types.ObjectId;
    passwordHash: string;
    username: string;
    email: string;
    tokenVersion: number;


    // ===== Profile ===== \\
    profileUrl: string;
    currentWinStreak: number 
    createdAt: Date 
} | null

export type SessionLean = {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    tokenVersion: number;
} | null

