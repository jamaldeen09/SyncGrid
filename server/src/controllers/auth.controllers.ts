import bcrypt from 'bcrypt';
import { LoginCredentials, SignupCredentials, SessionData, ProfileType } from '@shared/index.js';
import { Request } from 'express';
import { createToken, serverError } from '../services/auth.services.js';
import { ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { UserService } from '../services/user.service.js';
import { LoginLean, SessionLean } from '../types/auth.types.js';
import { RedisService } from '../services/redis.service.js';
import { ExistsQueryLean } from '../types/db-service.types.js';
import { GameService } from '../services/game.service.js';


// User service
const userService = new UserService();

// Redis service
const redisService = new RedisService()

// Game service
const gameService = new GameService();

export const signupController = async (req: Request, res: ConfiguredResponse) => {
    // Extract validated signup credentials attached to request
    const signupCredentials = (req as ConfiguredRequest).data as SignupCredentials
    try {
        const user = await userService.getSingleOrBulkUser<ExistsQueryLean>({
            result: "single",
            optionConfig: { optionType: "exists" },
            query: { email: signupCredentials.email },
        }) as ExistsQueryLean;

        // Check if the user's document already exists in the db
        if (user)
            return res.status(400).json({
                success: false,
                message: "Unable to complete registration, please try again or login",
                error: {
                    code: "REGISTRATION_ERROR",
                    statusCode: 400
                }
            });

        // Create a new document in the db
        const newUser = await userService.createUser(signupCredentials);

        // Profile data
        let profileData: ProfileType = {
            totalGamesWon: 0,
            profileUrl: newUser.profileUrl,
            currentWinStreak: newUser.currentWinStreak,
            createdAt: newUser.createdAt.toISOString(),
        };

        // Session data
        const sessionData = {
            userId: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            tokenVersion: newUser.tokenVersion
        }

        // Cache the session for 30 minutes
        const tokens = await userService.newSession({
            sessionData,
            refreshTokenPayload: {
                userId: newUser._id.toString(),
                tokenVersion: newUser.tokenVersion,
            },
        });

        // Cache profile data for 5 minutes
        await redisService.writeOperation<ProfileType>(`profile-${newUser._id}`, {
            ...profileData,
            username: newUser.username
        }, 300);

        return res.status(201).json({
            success: true,
            message: "Thank you for registering. Your account has been successfully created",
            data: {
                tokens,
                auth: sessionData,
                profile: profileData,
            },
        })
    } catch (err) {
        console.error(`Signup error\nFile: auth.controllers.ts\nController: signupController\n${err}`);
        serverError(res, "A server error occured while trying to register your account, please try again shortly", err)
    }
}


export const loginController = async (req: Request, res: ConfiguredResponse) => {
    // Extract validated login credentials attached to request
    const loginCredentials = (req as ConfiguredRequest).data as LoginCredentials;
    const loginErrObj = {
        success: false, 
        message: "Invalid login credentials",
        error: {
            code: "LOGIN_ERROR",
            statusCode: 401,
        }
    } 
    try {
        const user = await userService.getSingleOrBulkUser<LoginLean>({
            result: "single",
            optionConfig: { optionType: "find", option: "via-query" },
            query: { email: loginCredentials.email },
            selectFields: "passwordHash username email tokenVersion profileUrl currentWinStreak createdAt",
        }) as LoginLean;

        // Check if the user's document exists in the database
        if (!user)
            return res.status(401).json(loginErrObj);

        const isPasswordCorrect = await bcrypt.compare(loginCredentials.password, user.passwordHash);
        if (!isPasswordCorrect)
            return res.status(401).json(loginErrObj);


        // Search for the total number of games the requesting user has won
        // (for profile payload)
        const totalGamesWon = await gameService.countGameDocs({
            players: { $in: [user._id] },
            winner: user._id
        });

        // Session data
        const sessionData = {
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            tokenVersion: user.tokenVersion
        };

        // Profile data
        let profileData: ProfileType = {
            totalGamesWon,
            profileUrl: user.profileUrl,
            currentWinStreak: user.currentWinStreak,
            createdAt: user.createdAt.toISOString(),
        };

        // Cache session for 30 minutes
        const tokens = await userService.newSession({
            sessionData,
            refreshTokenPayload: {
                userId: user._id.toString(),
                tokenVersion: user.tokenVersion,
            },
        });

        // Cache profile data for 5 minutes
        await redisService.writeOperation<ProfileType>(`profile-${user._id}`, {
            ...profileData,
            username: user.username
        }, 300);

        return res.status(200).json({
            success: true,
            message: "You have successfully logged into your account",
            data: {
                tokens,
                auth: sessionData,
                profile: profileData
            }
        });
    } catch (err) {
        console.error(`Login error\nFile: auth.controllers.ts\nController: loginController\n${err}`);
        serverError(res, "A server error occured while trying to log you into your account, please try again shortly", err)
    }
};


export const getSessionController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const key = `session-${userId}`;

    try {
        const cachedSession = await redisService.readOperation(key);

        if (!cachedSession) {
            // ===== Cache miss ===== \\
            const user = await userService.getSingleOrBulkUser<SessionLean | null>({
                result: "single",
                optionConfig: { optionType: "find", option: "via-id" },
                id: userId,
                selectFields: "username email tokenVersion",
            }) as SessionLean | null;

            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "AUTHENTICATION_ERROR",
                        statusCode: 401,
                    }
                });

            // Cache the users session
            await userService.newSession({
                sessionData: {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    tokenVersion: user.tokenVersion,
                },

                returnTokens: false
            })

            return res.status(200).json({
                success: true,
                message: "Session data has been fetched successfully",
                data: user
            })
        } else {
            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "Session data has been fetched successfully",
                data: JSON.parse(cachedSession)
            })
        }
    } catch (err) {
        console.error(`Session fetch error\nFile: auth.controllers.ts\nController: getSessionController\n${err}`);
        serverError(res, "A server error occured while trying to fetch your session data, please try again shortly", err)
    }
};

export const refreshController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId, tokenVersion } = (req as ConfiguredRequest).refreshTokenPayload;
    const key = `session-${userId}`;

    try {
        const cachedSession = await redisService.readOperation(key);
        if (!cachedSession) {
            // ===== Cache miss ===== \\
            const user = await userService.getSingleOrBulkUser<SessionLean>({
                result: "single",
                optionConfig: {
                    option: "via-id",
                    optionType: "find"
                },
                id: userId,
                selectFields: "username email tokenVersion",
            }) as SessionLean;

            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "AUTHENTICATION_ERROR",
                        statusCode: 401,
                    }
                });

            if (tokenVersion !== user.tokenVersion) {
                await redisService.deleteOperation(key);
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "AUTHENTICATION_ERROR",
                        statusCode: 401,
                    }
                });
            }

            // Cache the users session
            const data = await userService.newSession({
                sessionData: {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    tokenVersion: user.tokenVersion,
                },

                returnTokens: true,
            })

            return res.status(200).json({
                success: true,
                message: "Token has been successfully refreshed",
                data: { token: data?.accessToken || "" },
            });
        } else {
            // ===== Cache hit ===== \\
            const session: SessionData = JSON.parse(cachedSession);

            // Check for token version
            if (tokenVersion !== session.tokenVersion) {
                await redisService.deleteOperation(key);
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "AUTHENTICATION_ERROR",
                        statusCode: 401,
                    }
                });
            }

            return res.status(200).json({
                success: true,
                message: "Token has been successfully refreshed",
                data: { token: createToken("accessToken", session) }
            });
        }
    } catch (err) {
        console.error(`Token refresh error\nFile: auth.controllers.ts\nController: getSessionController\n${err}`);
        serverError(res, "A server error occured during authentication, please try again shortly", err)
    }
}

export const logoutController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const key = `session-${userId}`
    try {
        // Delete the user's session from redis
        await redisService.deleteOperation(key);

        return res.status(200).json({
            success: true,
            message: "You have successfully logged out"
        })
    } catch (err) {
        console.error(`Logout error\nFile: auth.controllers.ts\nController: logoutController`);
        serverError(res, "A server error occured while trying to log you out of your account, please try again shortly", err)
    }
}