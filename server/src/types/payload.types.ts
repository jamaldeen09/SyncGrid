import mongoose from "mongoose";

export interface BusinessLogicType {
    success: boolean;
    data?: unknown;
    error?: unknown;
}

export interface RawGame {
    _id: mongoose.Types.ObjectId;

    players: {
        user_id: {
            _id: mongoose.Types.ObjectId;
            profile_url: string;
            username: string;
        }
        played_as: "X" | "O";
    }[];

    game_settings: {
        status: "matched" | "in_queue" | "finished" | "created";
        visibility: "private" | "public" | "canceled";
        disabled_comments: boolean;
        time_setting_ms: number;
        cancelation_reason: string | null,
        canceled_at: Date | null,
    }
};

export interface FormattedGame {
    _id: string;

    players: {
        _id: string;
        profile_url: string;
        username: string;
        played_as: "X" | "O";
    }[];

    game_settings: {
        status: "matched" | "in_queue" | "finished" | "created";
        visibility: "private" | "public" | "canceled";
        disabled_comments: boolean;
        time_setting_ms: number;
    }
};

export interface PaginationPayload {
    page: number;
    limit: number;
    totalPages: number;
    data: FormattedGame[];
}
