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

export interface ReferenceUser {
    _id: mongoose.Types.ObjectId;
    profile_url: string;
    username: string;
}

export interface RawGame {
    _id: mongoose.Types.ObjectId;

    players: {
        user_id: ReferenceUser;
        played_as: "X" | "O";
    }[];

    moves: {
        played_at: Date;
        played_by: ReferenceUser;
        value: "X" | "O";
        location: number;
    }[];

    game_settings: {
        status: "finished" | "created";
        visibility: "private" | "public" | "canceled";
        disabled_comments: boolean;
        time_setting_ms: number;
    };

    duration_ms: number;
    finished_at: Date | null;
};



export interface FormattedGame {
    _id: string;

    players: {
        _id: string;
        profile_url: string;
        username: string;
        played_as: "X" | "O";
    }[];

    moves: {
        played_at: Date;
        played_by: (Omit<ReferenceUser, "_id"> & { _id: string });
        value: "X" | "O";
        location: number;
    }[];

    game_settings: RawGame["game_settings"]

    duration_ms: number;
    finished_at: Date | null;
};



export interface GameDataFilters {
    page?: number;
    limit?: number;
    played_as?: "X" | "O";
    disabled_comments?: boolean;
    visibility?: "private" | "public"
    time_setting_ms?: number
}

export interface GameSettings {
    visibility: "private" | "public" | "canceled";
    disabled_comments: boolean;
    time_setting_ms: number;
    play_as_preference: "X" | "O";
};