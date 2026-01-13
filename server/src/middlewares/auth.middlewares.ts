import { NextFunction, Request } from "express";
import { matchedData, validationResult } from "express-validator"
import { ConfiguredRequest, ConfiguredResponse, ExtendedValidationError } from "../types/api.types.js";
import { serverError, validateToken } from "../services/auth.services.js";
import { UserService } from "../services/user.service.js";

// User service
const userService = new UserService();

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
        console.error(`Validation processing error\nFile: auth.middlewares.ts\nMiddleware: processValidationMiddleware\n${err}`);
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
        const user = await userService.getSingleOrBulkUser({
            result: "single",
            optionConfig: { optionType: "exists" },
            query: {
                $expr: {
                    $eq: [
                        { $toLower: "$username" },
                        username.toLowerCase()
                    ]
                }
            }
        });

        // Check if anyone with the provided username
        if (user)
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
        console.error(`Username availability check error\nFile: auth.middlewares.ts\nMiddleware: checkUsernameAvailabilityMiddleware\n${err}`);
        serverError(res, "A server error occured while trying to check if your username is acceptable, please try again shortly", err);
    }
}

export const verifyAccessTokenMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    const result = await validateToken(req, "accessToken");
    if (!result.success) return res.status(result.error?.statusCode! || 401).json(result);

    next();
}

export const verifyRefreshTokenMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    const result = await validateToken(req, "refreshToken");
    if (!result.success) return res.status(result.error?.statusCode! || 401).json(result);
    
    next();
}