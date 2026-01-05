import mongoose, { Model, Schema, Document } from "mongoose"

// Schema type
export interface IGame {
    _id: mongoose.Types.ObjectId;
    creator: mongoose.Types.ObjectId;
    players: {
        played_as: "X" | "O";
        user_id: mongoose.Types.ObjectId;
    }[];
    moves: {
        captured_at: Date;
        played_by: mongoose.Schema.Types.ObjectId;
        value: "X" | "O" | null;
        location: number;
    }[];


    game_settings: {
        status: "matched" | "in_queue" | "finished" | "created";
        visibility: "private" | "public" | "canceled";
        disabled_comments: boolean;
        time_setting_ms: number;
        cancelation_reason: string;
        canceled_at: Date;
    }
};


// this is going to be stored in db upon game creation = {
//   players: ["user_that_clicked_create", "randomly_found_user (if public game)"],
//   moves: [],
//   game_settings: {
//       status: "public",
//       disabled_comments: true
//       time_setting_ms: 3min //in ms
//    }
// }
// 



// this is going to be stored in redis for instant state syning = {
//    players: [{
//         playing_as: "X",
//         user_id: "some_user_id",
//         time_left_ms: "some_time",
//         time_left_till_deemed_unsuitable_for_match_ms: 20secs (since timers only start when both users make a move this is timer to force a user to make a move else the game gets canceled and dosent get stored)
//         
//    }, "randomly_found_user (if public game)"],
//    moves: [{
//        played_at: "some_date",
//        played_by: "some_user_id"
//        value: "X" | "O"
//        location: 0 (this is the index on the board of where the move belongs to)
//     }],
//     
//    current_turn: "X"
//    is_game_started: false (this is to decide when to start decremeting each users timer each user must play firstly before timer starts decrementing)
//
// }
// 
// 

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

    players: {
        type: [{
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
            enum: [],
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

        // Cancelation 
        cancelation_reason: {
            type: String,
            default: null
        },
        
        canceled_at: {
            type: Date,
            default: null
        },

        disabled_comments: {
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