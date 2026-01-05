import mongoose from "mongoose";
import { IGame } from "../models/Game.js";

export interface LiveGameSchema {
    _id: mongoose.Types.ObjectId;
    players: {
        playing_as: "X" | "O",
        user_id: mongoose.Types.ObjectId | string;
        time_left_ms: number;
        time_left_till_deemed_unsuitable_for_match_ms: number;
        last_active: Date;
    }[];
    
    status: "matched" | "in_queue" | "finished" | "created";
    visibility: "private" | "public" | "canceled";

    moves: IGame["moves"];
    current_turn: "X" | "O";
    is_game_started: boolean;
}; 


export interface GameSettings {
    visibility: "private" | "public" | "canceled";
    status: "matched" | "in_queue" | "finished" | "created";
    disabled_comments: boolean;
    time_setting_ms: number;
    play_as_preference: "X" | "O" 
};

