export interface MinimalGameSettings {
    preference: "X" | "O";
};

export interface GameSettings extends MinimalGameSettings {
    status: "active" | "in_queue" | "finished" | "created";
    visibility: "public" | "canceled";
}

export interface GameData {
    _id: string;
    players: {
        _id: string;
        preference: "X" | "O";
        username: string;
    }[];
    requestedUserInGameStatus: "Won" | "Loss" | "Draw"; 
    finishedAt: string;
    moves: number;
}


export interface GamesPayload {
    totalPages: number;
    totalGames: number;  
    page: number;
    limit: number;
    games: GameData[];
}
 
export interface LiveGame {
    _id: string;
    timeLeftTillGameCanceledMs: number; // this is useful if no one played after x seconds (in my case 20 seconds) then we cancel the game
    status: "active" | "finished";
    winner: string | null; // the userId of the person that won the game
    currentTurn: "X" | "O" // this decides who's turn it is to play

    // ===== Players ===== \\
    players: {
        // ===== Information ===== \\
        userId: string;
        // username: string;
        // profileUrl: string;
        // currentWinStreak: number;
        preference: "X" | "O";

        // ===== Time left ===== \\
        timeLeftMs: number; // Time left for this particular player
    }[];

    // ===== Moves ===== \\
    moves: {
        playedAt: Date;
        playedBy: string; // the userId of the person that played the move
        value: "X" | "O";
        boardLocation: number;
    }[];
};
  

export interface GetGamesData {
    // ===== Filters ===== \\
    visibility?: "public" | "private";
    preference?: "X" | "O";
    metric?: "wins" | "losses" | "draws";
    sortOrder?: "newest_to_oldest" | "oldest_to_newest"

    // ==== Pagination values ===== \\
    page?: number;
    limit?: number;
};


export interface FinishedGameData {
    _id: string;
    players: {
        userId: string;
        username: string;
        profileUrl: string;
        currentWinStreak: number;
        preference: "X" | "O"
    }[];
    moves: {
        playedBy: string; // users Id
        value: "X" | "O";
        boardLocation: number;
    }[];
}