import mongoose, { Document, Model, Schema } from "mongoose"

// Schema type
export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password_hash: string;
    username: string;
    profile_url: string;
    current_win_streak: number;
    status: "online" | "offline";
    token_version: number;
    last_login: Date;
    created_at: Date;
    updated_at: Date;
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

    password_hash: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
        lowercase: true,
        trim: true,
    },

    token_version: {
        type: Number,
        default: 1
    },

    username: {
        type: String,
        required: true,
        trim: true,
        match: [
            /^(?!-)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            `Username must pass these requirements:\n1. Must only contain letters, numbers, or hyphens\n2. Cannot begin with a hyphen\n3. Cannot end with a hyphen\n4. Cannot have consecutive hypens`
        ]
    },

    profile_url: {
        type: String,
        trim: true,
        default: "https://t4.ftcdn.net/jpg/07/03/86/11/360_F_703861114_7YxIPnoH8NfmbyEffOziaXy0EO1NpRHD.jpg",
    },

    current_win_streak: {
        type: Number,
        default: 0
    },

    last_login: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})


// Model
export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);