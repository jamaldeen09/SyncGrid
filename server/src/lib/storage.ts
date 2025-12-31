import mongoose from "mongoose";
import { IGame } from "../models/Game.js";

export interface LiveGameSchema {
    _id: mongoose.Types.ObjectId;
    players: {
        playing_as: "X" | "O",
        user_id: mongoose.Types.ObjectId | string;
        time_left_ms: number;
        time_left_till_deemed_unsuitable_for_match_ms: number;
    }[];
    state: "game_active" | "waiting_for_match" | "finished"
    moves: IGame["moves"];
    current_turn: "X" | "O";
    is_game_started: boolean;
}; 

export const matchmakingQueue: Map<mongoose.Types.ObjectId, LiveGameSchema> = new Map();