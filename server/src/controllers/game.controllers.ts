import { redisClient } from '../config/redis.config.js';
import { Game } from '../models/Game.js';
import { PaginationCredentials } from '../types/credentials.types.js';
import { GameSettings, LiveGameSchema } from '../types/game.types.js';
import { FormattedGame, PaginationPayload, RawGame } from '../types/payload.types.js';
import { User } from './../models/User.js';
import { ConfiguredRequest, ConfiguredResponse } from './../types/auth.types.js';
import { Request } from "express";

export const createGameController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request 
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const gameSettings = (req as ConfiguredRequest).data as GameSettings;

    try {
        const user = await User.exists({ _id: userId });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Account was not found",
                error: {
                    code: "NOT_FOUND",
                    statusCode: 400,
                },
            });

        const newGame = await Game.create({
            creator: user._id,
            players: [
                {
                    played_as: gameSettings.play_as_preference,
                    user_id: user._id
                }
            ],
            game_settings: {
                status: "in_queue",
                visibility: gameSettings.visibility,
                disabled_comments: gameSettings.disabled_comments,
                time_setting_ms: gameSettings.time_setting_ms,
            },
        });

        // Delete any paginated games pattern from redis
        const gameKeys = await redisClient.keys(`user:${user._id}-games*`);
        gameKeys.forEach(async (key) => {
            try { 
                await redisClient.del(key) 
            } catch (err) {
                console.error(`***** Game creation error *****\nFile: game.controllers.ts\nController: createGameController\n${err}`);
                return res.status(500).json({
                    success: false,
                    message: "A server error occured while trying to fufill your request to create a new game, please try again shortly",
                    error: {
                        code: "SERVER_ERROR",
                        statusCode: 500,
                    }
                })
            }
        });

        // Store the game state in redis
        const liveGameData: LiveGameSchema = {
            _id: newGame._id,
            players: newGame.players.map((player) => {
                return {
                    playing_as: player.played_as,
                    user_id: player.user_id,
                    time_left_ms: newGame.game_settings.time_setting_ms,
                    time_left_till_deemed_unsuitable_for_match_ms: 20000,
                    last_active: new Date()
                }
            }),
            status: newGame.game_settings.status,
            visibility: newGame.game_settings.visibility,
            moves: [],
            current_turn: "X",
            is_game_started: false,
        };

        // Store the live game in redis
        const cacheKey = `game:${newGame._id}`;
        await redisClient.setEx(cacheKey, 600, JSON.stringify(liveGameData));

        // Add the game to the matchmaking queue so other users can see it and join
        await redisClient.zAdd("matchmaking:queue", {
            value: `game:${newGame._id}`,
            score: Date.now(),
        })

        return res.status(201).json({
            success: true,
            message: "Game has been successfully created",
            data: {
                gameId: newGame._id,
                visibility: newGame.game_settings.visibility,
            }
        });
    } catch (err) {
        console.error(`***** Game creation error *****\nFile: game.controllers.ts\nController: createGameController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to fufill your request to create a new game, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}

export const getGamesController = async (req: Request, res: ConfiguredResponse) => {
    // Extract validated pagination values and user's id attached to request
    const paginationData = (req as ConfiguredRequest).data as PaginationCredentials;
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    // Make sure page and limit always exists
    const page = paginationData.page || 1;
    const limit = paginationData.limit || 8; // max limit

    // Create an offset using pagination values
    const offset = (page - 1) * limit;

    // Create a cache key, create a storage for db query
    let paginationPattern = `user:${userId}-games-page:${page}-limit:${limit}`;
    let databaseQuery: Record<any, any> = {}
    let sortQuery: Record<any, any> = { created_at: -1 }

    if (paginationData.disabled_comments !== undefined) {
        databaseQuery["game_settings.disabled_comments"] = paginationData.disabled_comments;
        paginationPattern += `-disabledComments:${paginationData.disabled_comments}`;
    }

    if (paginationData.status) {
        databaseQuery["game_settings.status"] = paginationData.status;
        paginationPattern += `-status:${paginationData.status}`;
    }

    if (paginationData.play_as) {
        databaseQuery["players"] = {
            $elemMatch: {
                user_id: userId,
                played_as: paginationData.play_as
            }
        };
        paginationPattern += `-playAs:${paginationData.play_as}`;
    }

    if (paginationData.sort_order) {
        if (paginationData.sort_order === "newest_first") sortQuery = { created_at: -1 }
        if (paginationData.sort_order === "oldest_first") sortQuery = { created_at: 1 }

        paginationPattern += `-sortOrder:${paginationData.sort_order}`
    }

    if (paginationData.visibility) {
        databaseQuery["game_settings.visibility"] = paginationData.visibility;
        paginationPattern += `-visibility:${paginationData.visibility}`;
    }

    if (paginationData.time_setting_ms) {
        databaseQuery["game_settings.time_setting_ms"] = paginationData.time_setting_ms;
        paginationPattern += `-timeSettingMs:${paginationData.time_setting_ms}`;
    }

    try {
        // Check if the specific pattern exists in cache
        const cachedPaginationData = await redisClient.get(paginationPattern);
        const totalGames = await Game.countDocuments({ 
            creator: userId,
            ...databaseQuery
        });
        const totalPages = Math.ceil(totalGames / limit);

        if (!cachedPaginationData) {
            // Check if the user exists in the database
            const user = await User.exists({ _id: userId });
            if (!user)
                return res.status(400).json({
                    success: false,
                    message: "Account was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 400,
                    },
                });


            // Fetch the users games
            const rawGames = await Game.find({
                creator: user._id,
                ...databaseQuery
            }).select("_id players game_settings")
                .skip(offset)
                .limit(limit)
                .sort(sortQuery).populate({
                    path: "players.user_id",
                    select: "profile_url username _id",
                }).lean<RawGame[]>();


            // Format the games
            const formattedGames: FormattedGame[] = rawGames.map((game) => {
                return {
                    _id: game._id.toString(),
                    players: game.players.map((player) => ({
                        _id: player.user_id._id.toString(),
                        username: player.user_id.username,
                        profile_url: player.user_id.profile_url,
                        played_as: player.played_as
                    })),

                    game_settings: {
                        visibility: game.game_settings.visibility,
                        status: game.game_settings.status,
                        disabled_comments: game.game_settings.disabled_comments,
                        time_setting_ms: game.game_settings.time_setting_ms,
                    }
                }
            });


            // Store the found games in redis
            const paginationData: PaginationPayload = {
                page,
                limit,
                totalPages,
                data: formattedGames,
            };

            await redisClient.set(paginationPattern, JSON.stringify(paginationData));

            // Return a success response
            return res.status(200).json({
                success: true,
                message: "Successfully fetched games",
                data: paginationData,
            });

        } else {
            const parsedPaginationData: PaginationPayload = JSON.parse(cachedPaginationData)
            return res.status(200).json({
                success: true,
                message: "Successfully fetched games",
                data: parsedPaginationData,
            })
        }
    } catch (err) {
        console.error(`***** Games fetch error *****\nFile: game.controllers.ts\nController: getGamesController\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to fetch your games, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
};

