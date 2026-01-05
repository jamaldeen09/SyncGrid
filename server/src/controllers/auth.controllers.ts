import { redisClient } from './../config/redis.config.js';
import { createToken } from './../services/auth.services.js';
import { IUserQuery, User } from './../models/User.js';
import { LoginCredentials, SignupCredentials } from '../types/credentials.types.js';
import { AccessTokenPayload, ConfiguredRequest, ConfiguredResponse, RefreshTokenPayload } from './../types/auth.types.js';
import { Request } from "express";
import bcrypt from "bcrypt"
import mongoose from 'mongoose';

export const signupController = async (req: Request, res: ConfiguredResponse) => {
    // Extract validated data attached to request
    const { username, email, password } = (req as ConfiguredRequest).data as SignupCredentials;

    try {
        // Check if the user already exists in the db
        const user = await User.exists({ email });
        if (user)
            return res.status(400).json({
                success: false,
                message: "Account already exists, please log in",
                error: {
                    code: "AUTHENTICATION_ERROR",
                    statusCode: 400,
                }
            });

        // Create the user in the db
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser: IUserQuery = await User.create({
            username,
            email,
            password_hash: hashedPassword,  
        });
        const cacheKey = `session:${newUser._id}`;  
        const authPayload: AccessTokenPayload = {
            userId: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
        };

        // Create tokens (access token and refresh token)
        const accessToken = createToken("accessToken", authPayload as AccessTokenPayload);

        const refreshToken = createToken("refreshToken", {
            userId: newUser._id.toString(),
            tokenVersion: newUser.token_version
        } as RefreshTokenPayload);


        // Store the user in redis
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(authPayload));

        return res.status(201).json({
            success: true,
            message: "Thank you for registering. Your account has been successfully created",
            data: {
                tokens: {
                    accessToken,
                    refreshToken
                },

                auth: authPayload
            },
        });
    } catch (err) {
        console.error(`***** Signup error *****\nFile: auth.controllers.ts\nController: signupController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured during the registration process, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}


export const loginController = async (req: Request, res: ConfiguredResponse) => {
    // Extract validated data attached to request
    const { email, password } = (req as ConfiguredRequest).data as LoginCredentials;

    try {
        // Check if the user exists in the db
        const user = await User.findOne({ email }).lean<{
            _id: mongoose.Types.ObjectId;
            email: string;
            username: string;
            password_hash: string;
            token_version: number;
        }>().select("_id username email password_hash token_version");
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials",
                error: {
                    code: "AUTHENTICATION_ERROR",
                    statusCode: 400,
                },
            });

        // Check if the user's credentials are valid
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid)
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials",
                error: {
                    code: "AUTHENTICATION_ERROR",
                    statusCode: 400,
                },
            });

        const cacheKey = `session:${user._id}`;
        const authPayload: AccessTokenPayload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        };

        // Create tokens (access token and refresh token)
        const accessToken = createToken("accessToken", authPayload as AccessTokenPayload);

        const refreshToken = createToken("refreshToken", {
            userId: user._id.toString(),
            tokenVersion: user.token_version
        } as RefreshTokenPayload);

        // Store the user in redis
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(authPayload));

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                tokens: {
                    accessToken,
                    refreshToken
                },

                auth: authPayload
            },
        });
    } catch (err) {
        console.error(`***** Login error *****\nFile: auth.controllers.ts\nController: loginController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to log you into your account, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}


export const getSessionController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const cacheKey = `session:${userId}`
    try {
        // Check if the user session was cached
        const cachedSession = await redisClient.get(cacheKey);
        if (!cachedSession) {
            // Check for the user's document
            const user: IUserQuery = await User.findById(userId).lean<{
                _id: mongoose.Types.ObjectId;
                username: string;
                email: string;
            }>().select("_id username email");

            if (!user)
                return res.status(400).json({
                    success: false,
                    message: "Account was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 400,
                    },
                });

            const authPayload: AccessTokenPayload = {
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
            };

            await redisClient.setEx(`session:${user._id}`, 1800, JSON.stringify(authPayload));
            return res.status(200).json({
                success: true,
                message: "Session data has been fetched successfully",
                data: { auth: authPayload }
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Session data has been fetched successfully",
                data: { auth: JSON.parse(cachedSession) }
            })
        }
    } catch (err) {
        console.error(`***** Session fetch error *****\nFile: auth.controllers.ts\nController: getSessionController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to fetch your session data, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}

export const refreshController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId, tokenVersion } = (req as ConfiguredRequest).refreshTokenPayload;
    try {

        const user: IUserQuery = await User.findById(userId).lean<{
            _id: mongoose.Types.ObjectId;
            email: string;
            username: string;
            token_version: number;
        }>().select("username email _id token_version");
        
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Account was not found",
                error: {
                    code: "NOT_FOUND",
                    statusCode: 400,
                },
            });

        if (user.token_version !== tokenVersion)
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                error: {
                    code: "AUTHENTICATION_ERROR",
                    statusCode: 403
                }
            });

        const accessToken = createToken("accessToken", {
            userId: user._id.toString(),
            username: user.username,
            email: user.email
        });

        return res.status(200).json({
            success: true,
            message: "Token has been successfully refreshed",
            data: {
                token: accessToken
            }
        });
    } catch (err) {
        console.error(`***** Token refresh error *****\nFile: auth.controllers.ts\nController: refreshController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to refresh your token, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}