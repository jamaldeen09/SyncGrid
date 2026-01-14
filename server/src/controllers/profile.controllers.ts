import { Request } from 'express';
import { ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { serverError } from '../services/auth.services.js';
import { UserService } from '../services/user.service.js';
import { RedisService } from '../services/redis.service.js';
import { ProfileLean } from '../types/profile.types.js';
import { GameService } from '../services/game.service.js';
import { ProfileType } from '@shared/index.js';

// User service
const userService = new UserService();

// Redis service
const redisService = new RedisService();

// Gaem service
const gameService = new GameService();

export const getProfileController = (profile: "requesting-user" | "requested-user") => {
    return async (req: Request, res: ConfiguredResponse) => {

        // User id's
        const tokenPayloadUserId = ((req as ConfiguredRequest).accessTokenPayload).userId;

        // Conditionally prepare userId
        let userId: string = "";
        if (profile === "requesting-user") userId = tokenPayloadUserId
        if (profile === "requested-user") userId = ((req as ConfiguredRequest).data as { userId: string }).userId;

        // Cache key
        const key = `profile-${userId}`;
        try {
            const cachedProfile = await redisService.readOperation(key);
            if (!cachedProfile) {
                // ===== Cache miss ===== \\
                const user = await userService.getSingleOrBulkUser<ProfileLean>({
                    result: "single",
                    optionConfig: { option: "via-id", optionType: "find" },
                    id: userId,
                    selectFields: "currentWinStreak createdAt updatedAt profileUrl username"
                }) as ProfileLean;

                // ===== Check if doc exists ===== \\
                if (!user) {
                    if (profile === "requesting-user") {
                        return res.status(401).json({
                            success: false,
                            message: "Unauthorized",
                            error: {
                                code: "UNAUTHORIZED",
                                statusCode: 401,
                            }
                        });
                    }

                    return res.status(404).json({
                        success: false,
                        message: "Requested user was not found",
                        error: {
                            code: "NOT_FOUND",
                            statusCode: 404
                        }
                    });
                }


                // Get the total amount of games won by the user
                const totalGamesWon = await gameService.countGameDocs({
                    players: { $in: [user._id] },
                    winner: user._id
                });

                // Profile data
                let profileData: ProfileType = {
                    totalGamesWon,
                    profileUrl: user.profileUrl,
                    currentWinStreak: user.currentWinStreak,
                    createdAt: user.createdAt.toISOString(),
                };

                // Cache the users profile for 5 minutes
                await redisService.writeOperation<ProfileType>(`profile-${user._id}`, {
                    ...profileData,
                    username: user.username
                });

                return res.status(200).json({
                    success: true,
                    message: "Profile data has been fetched successfully",
                    data: { 
                        profile: (profile === "requesting-user") ? (profileData) : ({
                            ...profileData,
                            username: user.username
                        })
                    }
                })
            } else {
                // ===== Cache hit ===== \\
                return res.status(200).json({
                    success: true,
                    message: "Your profile data has been fetched successfully",
                    data: { profile: JSON.parse(cachedProfile) }
                })
            }
        } catch (err) {
            // ===== Error handling (for requesting user and requested user) ===== \\
            if (profile === "requesting-user") {
                console.error(`Error occured during requesting user's profile fetch\nFile: profile.controllers.ts\nController: getRequestingUserProfileController\n${err}`);
                serverError(res, "A server error occured while trying to fetch your profile data, please try again shortly", err)
            } else {
                console.error(`Error occured while trying to fetch requested user's profile\nFile: profile.controllers.ts\nController: getRequestingUserProfileController\n${err}`);
                serverError(res, "A server error occured while trying to fetch the requested user's profile, please try again shortly", err)
            }
        }
    };
}

