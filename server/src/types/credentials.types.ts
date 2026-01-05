export interface SignupCredentials {
    username: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}


export interface PaginationCredentials {
    page?: number;
    limit?: number;
    status?: "matched" | "in_queue" | "finished" | "created";
    play_as?: "X" | "O"; // filter to show games where u chose to play as x or o
    disabled_comments?: boolean; // filter based on if the game's comments are disabled or not
    visibility?: "private" | "public" // filter to show private or public games
    time_setting_ms?: number // filter to show games with a specific time setting
    sort_order?: "newest_first" | "oldest_first"
}