import { redisClient } from '../config/redis.config.js';
import { Game } from '../models/Game.js';
import { GameSettings, GameDataFilters } from '../types/game.types.js';
import { FormattedGame, RawGame } from '../types/game.types.js';
import { PaginationPayload } from '../types/payload.types.js';
import { User } from './../models/User.js';
import { ConfiguredRequest, ConfiguredResponse } from './../types/auth.types.js';
import { Request } from "express";



// Store the game state in redis
// const liveGameData: LiveGameSchema = {
//     _id: newGame._id,
//     players: newGame.players.map((player) => {
//         return {
//             playing_as: player.played_as,
//             user_id: player.user_id,
//             time_left_ms: newGame.game_settings.time_setting_ms,
//             time_left_till_deemed_unsuitable_for_match_ms: 20000,
//             last_active: new Date()
//         }
//     }),
//     status: newGame.game_settings.status,
//     visibility: newGame.game_settings.visibility,
//     moves: [],
//     current_turn: "X",
//     is_game_started: false,
// };
// // Store the live game in redis
// const cacheKey = `live-game:${newGame._id}`;
// await redisClient.set(cacheKey, 600, JSON.stringify(liveGameData));


export const createGameController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id attached to request 
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const gameSettings = (req as ConfiguredRequest).data as GameSettings;

    try {
        const user = await User.exists({ _id: userId });
        if (!user)
            return res.status(404).json({
                success: false,
                message: "Account was not found",
                error: {
                    code: "NOT_FOUND",
                    statusCode: 404,
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
                status: "created",
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
    const paginationData = (req as ConfiguredRequest).data as GameDataFilters;
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    // Make sure page and limit always exists
    const page = paginationData.page || 1;
    const limit = paginationData.limit || 8; // max limit

    // Create an offset using pagination values
    const offset = (page - 1) * limit;

    // Create a cache key, create a storage for db query
    let paginationPattern = `user:${userId}-games-page:${page}-limit:${limit}`;
    let databaseQuery: Record<any, any> = {}

    if (paginationData.disabled_comments !== undefined) {
        databaseQuery["game_settings.disabled_comments"] = paginationData.disabled_comments;
        paginationPattern += `-disabledComments:${paginationData.disabled_comments}`;
    }

    if (paginationData.played_as) {
        databaseQuery["players"] = {
            $elemMatch: {
                user_id: userId,
                played_as: paginationData.played_as
            }
        };
        paginationPattern += `-playAs:${paginationData.played_as}`;
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
                return res.status(404).json({
                    success: false,
                    message: "Account was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 404,
                    },
                });


            // Fetch the games the user participated in (finished + created ONLY)
            const rawGames = await Game.find({
                "players.user_id": userId,
                "game_settings.status": {
                    $in: ["finished", "created"]
                },
                ...databaseQuery
            }).select("_id players game_settings duration_ms finished_at moves")
                .skip(offset)
                .limit(limit)
                .sort({ created_at: -1 }).populate([
                    {
                        path: "players.user_id",
                        select: "profile_url username _id",
                    },
                    {
                        path: "moves.played_by",
                        select: "profile_url username _id"
                    }
                ]).lean<RawGame[]>();

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

                    moves: game.moves.map((move) => {
                        const convertedId = move.played_by._id.toString();
                        return {
                            ...move,
                            played_by: {
                                ...move.played_by,
                                _id: convertedId,
                            }
                        }
                    }),

                    game_settings: game.game_settings,
                    duration_ms: game.duration_ms,
                    finished_at: game.finished_at,
                }
            });

            // Store the found games in redis
            const paginationData: PaginationPayload = {
                page,
                limit,
                totalPages,
                totalGames: formattedGames.length,
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

export const updateGameController = async (req: Request, res: ConfiguredResponse) => {
    const gameBeingUpdated = (req as ConfiguredRequest).game
    const userId = (req as ConfiguredRequest).userId;
    const gameSettings = (req as ConfiguredRequest).data as GameSettings;

    // Actual update data
    let updateData: Record<any, any> = {};
    try {
        const isRequestingUserInGame = gameBeingUpdated.players.some((player) => player.user_id.toString() === userId);
        if (!isRequestingUserInGame)
            return res.status(403).json({
                success: false,
                message: `You are not a player in this game`,
                error: {
                    code: "FORBIDDEN",
                    statusCode: 403,
                }
            });

        // Conditionally add to update data
        if (gameSettings.time_setting_ms) updateData = { ...updateData, time_settings_ms: gameSettings.time_setting_ms }
        if (gameSettings.disabled_comments) updateData = { ...updateData, disabled_comments: gameSettings.disabled_comments }
        if (gameSettings.visibility) updateData = { ...updateData, visibility: gameSettings.visibility }
        if (gameSettings.play_as_preference) {
            updateData.players = gameBeingUpdated.players.map((player) => {
                if (player.user_id.toString() === userId) {
                    return {
                        ...player,
                        played_as: gameSettings.play_as_preference
                    }
                }

                return player
            });
        }

        // Update only if update data was provided
        if (Object.keys(updateData).length > 1) {
            await Game.updateOne(
                { _id: gameBeingUpdated },
                { $set: updateData },
            );
        }

        return res.status(200).json({
            success: true,
            message: "Game updated successfully",
        });
    } catch (err) {
        console.error(`***** Game update error *****\nFile: game.controllers.ts\nController: updateGameController\n${err}`);
        return res.status(500).json({
            success: true,
            message: "A server error occured while trying to update your requested game, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        })
    }
}
