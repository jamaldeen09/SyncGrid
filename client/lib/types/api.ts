export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
    error?: {
        code: string,
        statusCode: number,
        details?: unknown,
    };
};

export interface ValidationError {
    field: string;
    message: string;
}