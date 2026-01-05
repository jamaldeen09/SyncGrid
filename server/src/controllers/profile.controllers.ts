import { Request } from "express";
import { ConfiguredRequest, ConfiguredResponse } from "../types/auth.types.js";
import { redisClient } from "../config/redis.config.js";
import { IUserQuery, User } from "../models/User.js";

export const getProfileController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const cacheKey = `profile:${userId}`;
    try {
        const cachedProfile = await redisClient.get(cacheKey);
        if (!cachedProfile) {
            const user: IUserQuery = await User.findById(userId).select("profile_url current_win_streak created_at updated_at");

            if (!user) 
                return res.status(400).json({
                    success: false,
                    message: "Account was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 400,
                    },
                });

            // Cache the user's profile details for performance
            await redisClient.setEx(`profile:${user._id}`, 300, JSON.stringify({
                profile_url: user.profile_url,
                current_win_streak: user.current_win_streak,
                created_at: user.created_at.toISOString(),
                updated_at: user.updated_at.toISOString(),
            }));
            
            return res.status(200).json({
                success: true,
                message: "Profile details have been fetched successfully",
                data: { profile: user }
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Profile details have been fetched successfully",
                data: { profile: JSON.parse(cachedProfile) }
            })
        }
    } catch (err) {
        console.error(`***** Profile fetch error *****\nFile: profile.controllers.ts\nController: getProfileController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to fetch your profile details, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}