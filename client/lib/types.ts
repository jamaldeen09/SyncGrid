export type SocketResponse = { 
    success: boolean; 
    message: string;
    data?: unknown;
    error?: {
        code: string,
        statusCode: number,
        details?: unknown,
    }
}

export interface Game {
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
    data: Game[];
}

export interface LiveGameSchema {
    _id: string;
    players: {
        playing_as: "X" | "O",
        user_id: string;
        time_left_ms: number;
        time_left_till_deemed_unsuitable_for_match_ms: number;
        last_active: Date;
    }[];
    
    status: "matched" | "in_queue" | "finished" | "created";
    visibility: "private" | "public" | "canceled";

    moves: {
        captured_at: Date;
        played_by: {
            user_id: string;
            username: string;
            profile_url: string;
        }
        value: "X" | "O" | null;
        location: number;
    }[];
    
    current_turn: "X" | "O";
    is_game_started: boolean;
}; 
