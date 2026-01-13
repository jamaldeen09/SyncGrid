import { Request } from "express";
import { envData } from "../config/env.config.js";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.types.js";
import jwt from "jsonwebtoken"
import { ApiResponsePayload, ConfiguredRequest, ConfiguredResponse } from "../types/api.types.js";

/**
 * Creates a jwt access/refresh token
 * @param type 
 * @param payload
 * @returns {string} 
 */
export const createToken = (type: "accessToken" | "refreshToken", payload: AccessTokenPayload | RefreshTokenPayload): string => {
    return jwt.sign(
        payload,
        envData[type === "accessToken" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET"],
        { expiresIn: type === "accessToken" ? "5m" : "5d" }
    );
}

/**
 * Used to validate both access and refresh tokens
 * @param req 
 * @param tokenType 
 */
export const validateToken = async (req: Request, tokenType: "accessToken" | "refreshToken"): Promise<ApiResponsePayload> => {
    const unauthorizedResponse = {
        success: false,
        message: "Unauthorized",
        error: {
            code: "AUTHENTICATION_ERROR",
            statusCode: 401
        }
    }

    try {
        let token: string | undefined;
        const secret = tokenType === "accessToken" ? envData.ACCESS_TOKEN_SECRET : envData.REFRESH_TOKEN_SECRET

        // Conditionally decide which token to extract from headers (access/refresh) based on tokenType
        if (tokenType === "accessToken") token = req.headers.authorization?.split(" ")[1];
        if (tokenType === "refreshToken") token = req.headers["x-refresh-token"] as string | undefined;

        // Check if the token was provided after extracting it from the headers
        if (!token)  return unauthorizedResponse

        // Attach decoded payload to request
        const decoded = jwt.verify(token, secret) as AccessTokenPayload | RefreshTokenPayload;

        const payload = tokenType === "accessToken" ? {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        } as AccessTokenPayload : {
            userId: decoded.userId,
            tokenVersion: decoded.tokenVersion,
        } as RefreshTokenPayload;

        if (tokenType === "accessToken") (req as ConfiguredRequest).accessTokenPayload = payload as AccessTokenPayload;
        if (tokenType === "refreshToken") (req as ConfiguredRequest).refreshTokenPayload = payload as RefreshTokenPayload;

        return {
            success: true,
            message: "Token has been validated successfully"
        }
    } catch (err: unknown) {
        if (err instanceof jwt.JsonWebTokenError) return unauthorizedResponse
        if (err instanceof jwt.TokenExpiredError) return unauthorizedResponse
    
        return {
            success: false,
            message: "A server error occured during authentication",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500
            }
        }
    }
}

export const serverError = (res: ConfiguredResponse, errMsg: string, err: unknown) => {
    return res.status(500).json({
        success: false,
        message: errMsg,
        error: {
            code: "SERVER_ERROR",
            statusCode: 500,
            details: err,
        }
    })
}