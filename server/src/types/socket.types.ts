export type SocketResponse = (response: { 
    success: boolean; 
    message: string;
    data?: unknown;
    error?: {
        code: string,
        statusCode: number,
        details?: unknown,
    }
}) => void