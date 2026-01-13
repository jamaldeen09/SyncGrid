export interface SignupCredentials {
    username: string;
    password: string;
    email: string;
}

export interface LoginCredentials {
    password: string;
    email: string;
}


export interface SessionData {
    userId: string
    username: string;
    email: string;
    tokenVersion: number;
}