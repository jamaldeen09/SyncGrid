import mongoose from "mongoose";

export type ProfileLean = {
    _id: mongoose.Types.ObjectId;
    profileUrl: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    bio: string | null;
    status: "offline" | "online";
    bestWinStreak: number;
} | null;

