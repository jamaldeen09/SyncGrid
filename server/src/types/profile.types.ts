import mongoose from "mongoose";

export type ProfileLean = {
    _id: mongoose.Types.ObjectId;
    profileUrl: string;
    currentWinStreak: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
} | null;

