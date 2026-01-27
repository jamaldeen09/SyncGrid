export interface ProfileType {
    userId: string;
    totalGamesWon: number;
    profileUrl: string;
    createdAt: string;
    username: string;
    totalGamesPlayed: number;
    bestWinStreak: number;
    bio: string | null;
    winRate: number;
};

export interface UiProfileType {
    profileUrl: string;
    username: string;
    bio: string;
}

export interface EditProfileData {
    username?: string;
    bio?: string;
    profileFile?: File;
}