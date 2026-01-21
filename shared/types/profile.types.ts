export interface ProfileType {
    userId: string;
    totalGamesWon: number;
    profileUrl: string;
    createdAt: string;
    username: string;
    totalGamesPlayed: number;
    bestWinStreak: number;
    bio: string | null;
    status: "offline" | "online";
};

export interface UiProfileType {
    profileUrl: string;
    username: string;
    currentWinStreak: number;
}

export interface EditProfileData {
    username?: string;
    bio?: string;
    profileFile?: File;
}