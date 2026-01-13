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

export const getProfileController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const key = `profile-${userId}`;

    try {
        const cachedProfile = await redisService.readOperation(key);
        if (!cachedProfile) {
            // ===== Cache miss ===== \\
            const user = await userService.getSingleOrBulkUser<ProfileLean>({
                result: "single",
                optionConfig: {
                    option: "via-id",
                    optionType: "find"
                },
                id: userId,
                selectFields: "currentWinStreak createdAt updatedAt profileUrl"
            }) as ProfileLean;

            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: {
                        code: "UNAUTHORIZED",
                        statusCode: 401,
                    }
                });

            // Get the total amount of games won by the user
            const totalGamesWon = await gameService.countGameDocs({
                players: { $in: [user._id] },
                winner: user._id
            });

            // Profile data
            const profileData: ProfileType = {
                totalGamesWon,
                profileUrl: user.profileUrl,
                currentWinStreak: user.currentWinStreak,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            }

            // Cache the users profile for 5 minutes
            await redisService.writeOperation<ProfileType>(`profile-${user._id}`, profileData);

            return res.status(200).json({
                success: true,
                message: "Profile data has been fetched successfully",
                data: { profile: profileData }
            })
        } else {
            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "Profile data has been fetched successfully",
                data: { profile: JSON.parse(cachedProfile) }
            })
        }
    } catch (err) {
        console.error(`Profile fetch error\nFile: profile.controllers.ts\nController: getProfileController\n${err}`);
        serverError(res, "A server error occured while trying to fetch your profile data, please try again shortly", err)
    }
} 