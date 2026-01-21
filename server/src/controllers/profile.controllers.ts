import { Request } from 'express';
import { ApiResponsePayload, ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { serverError } from '../services/auth.services.js';
import { UserService } from '../services/user.service.js';
import { RedisService } from '../services/redis.service.js';
import { ProfileLean } from '../types/profile.types.js';
import { GameService } from '../services/game.service.js';
import { ProfileType, UiProfileType } from '@shared/index.js';
import mongoose from 'mongoose';

// User service
const userService = new UserService();

// Redis service  
const redisService = new RedisService();

// Gaem service
const gameService = new GameService();


export const getProfileController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the desired profile's username
    const { username } = (req as ConfiguredRequest).data as { username: string };
    const key = `public-profile:${username.toLowerCase()}`; // convert the username to the lowercased version just for consistency

    try {
        // Check for cached profile
        const cachedProfile = await redisService.readOperation(key);

        if (!cachedProfile) {
            // ===== Cache miss ===== \\
            // User
            const user = await userService.getSingleOrBulkUser<ProfileLean>({
                result: "single",
                optionConfig: {
                    option: "via-query",
                    optionType: "find"
                },
                query: {
                    $expr: {
                        $eq: [
                            { $toLower: "$username" },
                            username.toLowerCase()
                        ]
                    }
                },
                selectFields: "createdAt updatedAt profileUrl username bestWinStreak bio status"
            }) as ProfileLean;

            // User was not found
            if (!user)
                return res.status(404).json({
                    success: false,
                    message: "User was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 404
                    }
                });

            // Get the total amount of games won by the user
            const totalGamesWon = await gameService.countGameDocs({
                "players.userId": user._id,
                winner: user._id
            });

            // Get the total number of games a user has played
            const totalGamesPlayed = await gameService.countGameDocs({
                "players.userId": user._id
            })

            // Profile data
            let profileData: ProfileType = {
                userId: user._id.toString(),
                username: user.username,
                bestWinStreak: user.bestWinStreak,
                totalGamesWon,
                totalGamesPlayed,
                profileUrl: user.profileUrl,
                createdAt: user.createdAt.toISOString(),
                bio: user.bio,
                status: user.status
            };

            // Cache the user in redis
            await redisService.writeOperation<ProfileType>(`profile-${user.username.toLowerCase()}`, profileData, 300);

            return res.status(200).json({
                success: true,
                message: "User's profile has been fetched successfully",
                data: {
                    profile: profileData
                }
            })
        } else {
            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "User's profile has been fetched successfully",
                data: {
                    profile: {
                        ...(JSON.parse(cachedProfile)),
                    }
                }
            });
        }
    } catch (err) {
        console.error(`Profile fetch error\nFile: profile.controllers.ts\nController: getProfileController\n${err}`);
        serverError(res, `Failed to fetch user's profile`, err);
    }
};


export const getRequestingUserProfileController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the requesting user's username
    const { userId } = ((req as ConfiguredRequest).accessTokenPayload);
    const key = `private-profile:${userId}`;

    try {
        // Check for cached profile
        const cachedProfile = await redisService.readOperation(key);

        if (!cachedProfile) {
            // ===== Cache miss ===== \\
            const user = await userService.getSingleOrBulkUser<(UiProfileType & {
                _id: mongoose.Types.ObjectId
            })>({
                result: "single",
                optionConfig: {
                    optionType: "find",
                    option: "via-id"
                },
                id: userId,
                selectFields: "username profileUrl currentWinStreak"
            }) as (UiProfileType & {
                _id: mongoose.Types.ObjectId
            });

            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "Unauthorized",
                        statusCode: 401
                    }
                });

            // Profile data
            const profileData = {
                username: user.username,
                profileUrl: user.profileUrl,
                currentWinStreak: user.currentWinStreak,
            };

            await redisService.writeOperation<UiProfileType>(key, profileData, 300);

            return res.status(200).json({
                success: true,
                message: "Your profile data has been fetched successfully",
                data: { profile: profileData }
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
        console.error(`Profile fetch error\nFile: profile.controllers.ts\nController: getRequestingUserProfileController\n${err}`);
        serverError(res, `Failed to fetch your profile`, err);
    }
}

export const editProfileController = async (req: Request, res: ConfiguredResponse) => {
    // User's id
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    // Update data
    const updateData = (req as ConfiguredRequest).data as { bio?: string; username?: string; };
    const profileUrl = (req as ConfiguredRequest).profileUrl;

    // Boolean to determine if the requesting user is eligible for an update
    const isEligibleForUpdate = Object.keys(updateData).length >= 1 || profileUrl
    try {
        if (isEligibleForUpdate) {
            // Update query
            let updateQuery: {
                username?: string;
                bio?: string;
                profileUrl?: string;
            } = {...updateData};

            // Conditionally add profile url
            if (profileUrl) updateQuery["profileUrl"] = profileUrl;

            // Update the user
            const user = await userService.updateUser<{
                _id: mongoose.Types.ObjectId,
                username: string;
            } | null>({
                returnUpdatedDoc: true,
                updateQuery,
                optionConfig: { optionType: "find", option: "via-id" },
                id: userId,
                selectFields: "username"
            }) as {
                _id: mongoose.Types.ObjectId
                username: string;
            } | null;

            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "UNAUTHORIZED",
                        statusCode: 401,
                    },
                });


            // Delete cache key
            const firstKey = `private-profile:${user._id}`;
            const secondKey = `public-profile:${user.username}`;

            // Delete both private and public cache keys
            await redisService.deleteOperation(firstKey);
            await redisService.deleteOperation(secondKey)
        };

        // Response obj being sent to frontend
        let responseJSON: ApiResponsePayload = {
            success: true,
            message: "Your profile has been updated successfully",
        };

        return res.status(200).json(responseJSON);
    } catch (err) {
        console.error(`Profile update error\nFile: profile.controllers.ts\nController: editProfileController\n${err}`);
        serverError(res, "A server error occured while trying to update your profile, please try again shortly", err);
    }
}