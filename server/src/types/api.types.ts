import { ValidationError } from "express-validator";
import { Request, Response } from "express";
import { AccessTokenPayload, RefreshTokenPayload } from "./auth.types";

export interface ConfiguredRequest extends Request {
    accessTokenPayload: AccessTokenPayload;
    refreshTokenPayload: RefreshTokenPayload;
    data: unknown;
}

export interface ApiResponsePayload {
    success: boolean;
    message: string;
    data?: unknown;
    error?: {
        code: string;
        statusCode: number;
        details?: unknown;
    }
};


export type ExtendedValidationError  = ValidationError & {
    path: string;
    param: string;
};

export type ConfiguredResponse = Response<ApiResponsePayload>;