import mongoose, { Model, Schema, Document } from "mongoose"


// Schema type
export interface IGame {
    _id: mongoose.Types.ObjectId;
    winner: mongoose.Types.ObjectId | null;
    result: "decisive" | "draw" | "pending";

    // ===== Players ===== \\
    players: {
        preference: "X" | "O";
        userId: mongoose.Types.ObjectId;
    }[];
 
    // ===== Moves ===== \\
    moves: {
        playedAt: Date;
        playedBy: mongoose.Schema.Types.ObjectId;
        value: "X" | "O";
        boardLocation: number;
    }[];

    // ===== Game settings ===== \\
    gameSettings: {
        status: "active" | "finished";
        visibility: "public" | "private";
    };

    // ===== Game duration and finish date ==== \\
    durationMs: number;
    finishedAt: Date;

    // ===== Timestamps ===== \\
    createdAt: Date;
    updatedAt: Date;
};


// Useful types
export type IGameDocument = Document & IGame;
export type IGameModel = Model<IGameDocument>;
export type IGameQuery = IGameDocument | null;


// Schema
const GameSchema = new Schema<IGameDocument, IGameModel>({
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    result: {
        type: String,
        enum: ["decisive", "draw", "abandoned", "pending"],
        default: "pending",
        lowercase: true,
        trim: true,
    },

    players: {
        type: [{
            preference: {
                type: String,
                enum: ["X", "O"],
                required: true,
                trim: true,
                uppercase: true,
            },

            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                trim: true,
            },
            _id: false,
        }],

        minLength: 1,
        maxLength: 2,
    },

    moves: {
        type: [{
            playedAt: {
                type: Date,
                required: true
            },

            playedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                trim: true,
            },

            value: {
                type: String,
                enum: ["X", "O"],
                required: true,
                trim: true,
                uppercase: true,
            },

            boardLocation: {
                type: Number,
                required: true,
                min: 0,
                max: 9,
            },

            _id: false,
        }],

        maxLength: 9,
        default: [],
    },

    gameSettings: {
        status: {
            type: String,
            enum: ["active", "finished"],
            lowercase: true,
            trim: true,
            required: true,
        },

        visibility: {
            type: String,
            enum: ["public", "private"],
            lowercase: true,
            trim: true,
            required: true,
        },
    },

    durationMs: {
        type: Number,
        default: 0,
    },

    finishedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});


// Model
export const Game = mongoose.model<IGameDocument, IGameModel>("Game", GameSchema);