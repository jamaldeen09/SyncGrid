import mongoose, { Model, Schema, Document } from "mongoose"

// Schema type
export interface IGame {
    _id: mongoose.Types.ObjectId;
    players: {
        played_as: "X" | "O";
        user_id: mongoose.Types.ObjectId;
    }[];
    moves: {
        captured_at: Date;
        played_by: mongoose.Schema.Types.ObjectId;
        value: "X" | "O" | null;
    }[];

    game_settings: {
        status: "private" | "public";
        disabled_comments: boolean;
        time_setting_ms: number
    }
};

// Useful types
export type IGameDocument = Document & IGame;
export type IGameModel = Model<IGameDocument>;
export type IGameQuery = IGameDocument | null;


// Schema
const GameSchema = new Schema<IGameDocument, IGameModel>({
    players: [{
        played_as: {
            type: String,
            enum: ["X", "O"],
            required: true,
            trim: true,
            uppercase: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            trim: true,
        }
    }],

    moves: {
        type: [{
            captured_at: {
                type: Date,
                required: true
            },

            played_by: {
                type: mongoose.Schema.Types.ObjectId,
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

            location: {
                type: Number,
                required: true,
                minLength: 0,
                maxLength: 9,
            }
        }],

        maxLength: 9,
        default: [],
    },

    game_settings: {
        status: {
            type: String,
            enum: ["private", "public"],
            lowercase: true,
            trim: true,
            required: true
        },

        disable_comments: {
            type: Boolean,
            default: true,
        },

        time_setting_ms: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});


// Model
export const Game = mongoose.model<IGameDocument, IGameModel>("Game", GameSchema);