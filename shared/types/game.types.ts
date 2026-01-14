export interface MinimalGameData {
    timeSettingMs: number;
    preference: "X" | "O";
};


export interface LiveGame {
    _id: string;
    timeLeftTillGameCanceledMs: number; // this is useful if no one played after x seconds (in my case 20 seconds) then we cancel the game
    status: "matched" | "in_queue" | "canceled" 
    winner: string; // the userId of the person that won the game
    currentTurn: "X" | "O" // this decides who's turn it is to play
    canceledAt: Date | null, // useful timestamp to know when the game got canceled

    // ===== Players ===== \\
    players: {
        // ===== Information ===== \\
        userId: string;
        username: string;
        profileUrl: string;
        currentWinStreak: number;
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

    createdAt: Date // Used to know when the game was created
};