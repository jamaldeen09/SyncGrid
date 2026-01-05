import { Request, Response } from "express";
import { ValidationError } from "express-validator";
import jwt from "jsonwebtoken"

export interface AccessTokenPayload extends jwt.JwtPayload {
    userId: string;
    email: string;
    username: string;
};

export interface RefreshTokenPayload extends jwt.JwtPayload {
    userId: string;
    tokenVersion: number;
};


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