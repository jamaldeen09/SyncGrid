import { NextFunction, Request } from "express";
import { ConfiguredRequest, ConfiguredResponse, ExtendedValidationError } from "../types/auth.types.js";
import { matchedData, validationResult } from "express-validator"
import { User } from "../models/User.js";
import { validateToken } from '../services/auth.services.js';


export const processValidationMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    try {
        // Extract possible errors from req
        const errors = validationResult(req);

        // Handles cases where errors do exist
        if (!errors.isEmpty()) {
            // Extract only the field the error occured and the error message provided by express validator
            const formattedErrors = errors.array().map((error: unknown) => {
                const typedError = error as ExtendedValidationError
                return {
                    field: typedError.path ?? typedError.param ?? "unknown",
                    message: typedError.msg,
                }
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: {
                    code: "VALIDATION_ERROR",
                    statusCode: 400,
                    details: { validationErrors: formattedErrors }
                }
            });
        };
        // Attach validated data to request
        (req as ConfiguredRequest).data = matchedData(req);
        next();
    } catch (err) {
        console.error(`***** Validation processing error *****\nFile: auth.middlewares.ts\nMiddleware: processValidationMiddleware\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to validate your data, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        });
    }
}


export const checkUsernameAvailabilityMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    // Extract the validated username attached to request
    const { username } = (req as ConfiguredRequest).data as { username: string };

    try {
        // Check if anyone with this username exists 
        const existingUser = await User.exists({
            $expr: {
                $eq: [
                    { $toLower: "$username" },
                    username.toLowerCase()
                ]
            }
        });

        if (existingUser)
            return res.status(400).json({
                success: false,
                message: "Username is already taken",
                error: {
                    code: "FIELD_ERROR",
                    statusCode: 400,
                }
            });

        next();
    } catch (err) {
        console.error(`***** Username availability check error *****\nFile: auth.middlewares.ts\nMiddleware: checkUsernameAvailabilityMiddleware\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to validate your data, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        });
    }
}

export const verifyAccessTokenMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    try {
        const result = await validateToken(req, "accessToken");
        if (!result.success) return res.status(result.error?.statusCode! || 401).json(result);
        
        next();
    } catch (err: unknown) {
        console.error(`***** Access token verification error *****\nFile: auth.middlewares.ts\nMiddleware: verifyAccessTokenMiddleware\n${err}`);

        return res.status(500).json({
            success: false,
            message: "A server error occured during token verification",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500
            }
        })
    }
}



export const verifyRefreshTokenMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    try {
        const result = await validateToken(req, "refreshToken");
        if (!result.success) return res.status(result.error?.statusCode! || 401).json(result);
        
        next();
    } catch (err: unknown) {
        console.error(`***** Refresh token verification error *****\nFile: auth.middlewares.ts\nMiddleware: verifyRefreshTokenMiddleware\n${err}`);

        return res.status(500).json({
            success: false,
            message: "A server error occured during token verification",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500
            }
        })
    }
}