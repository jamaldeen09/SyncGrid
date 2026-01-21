import mongoose, { Document, Model, Schema } from "mongoose"

// Schema type
export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    bio: string;
    status: "online" | "offline";
    passwordHash: string;
    username: string;
    profileUrl: string;
    currentWinStreak: number;
    bestWinStreak: number;
    tokenVersion: number;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
};


// Useful types
export type IUserDocument = Document & IUser
export type IUserModel = Model<IUserDocument>;
export type IUserQuery = IUserDocument | null;

// Schema
const UserSchema = new Schema<IUserDocument, IUserModel>({
    email: {
        type: String,
        required: true,
        trim: true, 
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
 
    passwordHash: {
        type: String,
        required: true,
        trim: true,
    },

    tokenVersion: {
        type: Number,
        default: 1
    },

    username: {
        type: String,
        required: true, 
        trim: true,
        index: true,
        match: [
            /^(?!-)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            `Username must pass these requirements:\n1. Must only contain letters, numbers, or hyphens\n2. Cannot begin with a hyphen\n3. Cannot end with a hyphen\n4. Cannot have consecutive hypens`
        ]
    },

    bio: {
        type: String,
        maxLength: 50,
        trim: true,
        default: "Hi there im using syncgrid"
    },

    status: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["offline", "online"],
        default: "offline"
    },

    profileUrl: {
        type: String,
        trim: true,
        default: "https://t4.ftcdn.net/jpg/07/03/86/11/360_F_703861114_7YxIPnoH8NfmbyEffOziaXy0EO1NpRHD.jpg",
    },

    currentWinStreak: {
        type: Number,
        default: 0
    },

    bestWinStreak: {
        type: Number,
        default: 0
    },

    lastLogin: {
        type: Date,
        default: Date.now,
    },
}, { 
    timestamps: true
})


// Model
export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);