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