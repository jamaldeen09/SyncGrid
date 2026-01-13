import mongoose, { Model, Schema, Document } from "mongoose"


// Schema type
export interface IGame {
    _id: mongoose.Types.ObjectId;

    // ===== game creator and winner ===== \\
    creator: mongoose.Types.ObjectId;
    winner: mongoose.Types.ObjectId | null;

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
        status: "matched" | "in_queue" | "finished" | "created";
        visibility: "public" | "canceled";
        timeSettingMs: number;
    };

    // ===== Game duration and finish date ==== \\
    durationMs: number;
    finishedAt: Date;

    // ===== Cancelation ===== \\
    cancelationReason: string;
    canceledAt: Date;

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
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },

    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
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
            played_at: {
                type: Date,
                required: true
            },

            played_by: {
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
            enum: ["matched", "in_queue", "finished", "created"],
            lowercase: true,
            trim: true,
            required: true,
        },

        visibility: {
            type: String,
            enum: ["private", "public", "canceled"],
            lowercase: true,
            trim: true,
            required: true
        },

        timeSettingMs: {
            type: Number,
            required: true
        }
    },

    durationMs: {
        type: Number,
        default: 0,
    },

    finishedAt: {
        type: Date,
        default: null,
    },

    // Cancelation 
    cancelationReason: {
        type: String,
        default: null
    },

    canceledAt: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});


// Model
export const Game = mongoose.model<IGameDocument, IGameModel>("Game", GameSchema);