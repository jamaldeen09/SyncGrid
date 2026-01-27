import { Request } from 'express';
import { serverError } from '../services/auth.services.js';
import { ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { ActiveOrFinishedGameData, GameData, GamesPayload, GetGamesData } from '@shared/index.js';
import { gameService } from '../services/game.service.js';
import { redisService } from '../services/redis.service.js';
import { ActiveOrFinishedGameLean, BulkGamesLean } from '../types/game.types.js';
import mongoose from 'mongoose';

export const getGameController = async (req: Request, res: ConfiguredResponse) => {
    // Game type
    let gameType = req.query.gameType as "live-game" | "finished-game";
    let userId = ""
 
    // Set the current users if only if the game is being used
    // as a live game
    if (gameType === "live-game") userId = ((req as ConfiguredRequest).accessTokenPayload).userId;
    // Extract the game id attached to request
    const gameId = (req as ConfiguredRequest).params.gameId as string | undefined

    // Key
    const key = `game:${gameId}`;

    try {
        const cachedGame = await redisService.readOperation(key);

        if (!cachedGame) {
            // ===== Cache miss ===== \\
            const game = await gameService.getBulkOrSingleGame<ActiveOrFinishedGameLean>({
                result: "single",
                optionConfig: { optionType: "find", option: "via-id" },
                id: gameId,
                selectFields: "players gameSettings moves",
                populateOptions: {
                    path: "players.userId",
                    select: "_id username profileUrl currentWinStreak"
                },
            }) as ActiveOrFinishedGameLean;

            // Check if the game exists
            if (!game)
                return res.status(404).json({
                    success: false,
                    message: "Game was not found",
                    error: {
                        code: "NOT_FOUND",
                        statusCode: 404
                    }
                });

            // ** CHECK
            // if the game type is a "live-game" - if so check if the game is active and check if the requesting user is
            // a player in the game to restrict anyhow users from viewing a live game because
            // "specators" aren't allowed yet

            // or if game type if as a finished game - just check if the game is active if not 
            // prevent anyone from viewing it
            if (gameType === "live-game") {
                const isRequestingUserAPlayer = game.players.some((player) => player.userId._id.toString() == userId)
                if (
                    (game.gameSettings.status === "active") && !isRequestingUserAPlayer)
                    return res.status(403).json({
                        success: false,
                        message: "You cannot view this game because it is currently live",
                        error: {
                            code: "NOT_ALLOWED",
                            statusCode: 403
                        }
                    })
            } else {
                if (game.gameSettings.status === "active") {
                    return res.status(403).json({
                        success: false,
                        message: "You cannot view this game because it is currently live",
                        error: {
                            code: "NOT_ALLOWED",
                            statusCode: 403
                        }
                    })
                }
            }

            // Prepare data to send to frontend
            const gameData: ActiveOrFinishedGameData = ({
                ...game,
                _id: game._id.toString(),
                status: game.gameSettings.status,
                players: game.players.map((player) => ({
                    ...player.userId,
                    userId: player.userId._id.toString(),
                    preference: player.preference,
                })),
                moves: game.moves.map((move) => ({
                    playedBy: move.playedBy.toString(),
                    value: move.value,
                    boardLocation: move.boardLocation,
                    playedAt: move.playedAt.toISOString(),
                })),
            });

            // Cache the game for 5 minutes
            await redisService.writeOperation<ActiveOrFinishedGameData>(key, gameData, 300);

            return res.status(200).json({
                success: true,
                message: "Game has been fetched successfully",
                data: ({
                    game: gameData
                })
            });
        } else {
            const gameData = JSON.parse(cachedGame) as ActiveOrFinishedGameData;
            if (gameType === "live-game") {
                const isRequestingUserAPlayer = gameData.players.some((player) => player.userId == userId)
                if (
                    (gameData.status === "active") && !isRequestingUserAPlayer)
                    return res.status(403).json({
                        success: false,
                        message: "You do not have the permission to view this game",
                        error: {
                            code: "NOT_ALLOWED",
                            statusCode: 403,
                        }
                    });
            } else {
                if (gameData.status === "active") {
                    return res.status(403).json({
                        success: false,
                        message: "This game is currently live, try again later",
                        error: {
                            code: "NOT_ALLOWED",
                            statusCode: 403
                        }
                    })
                }
            }

            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "Game has been fetched successfully",
                data: { game: gameData }
            })
        }
    } catch (err) {
        console.error(`Game fetch error\nFile: game.controllers.ts\nController: getGameContoller\n${err}`);
        serverError(res, "A server error occured while trying to fetch the requested game, please try again shortly", err);
    }
}

export const getGamesController = async (req: Request, res: ConfiguredResponse) => {
    // Extract the user's id
    const { userId } = (req as ConfiguredRequest).data as { userId: string };

    // Data
    const data = (req as ConfiguredRequest).data as GetGamesData;

    // Pagination
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit

    // Prepare query and key
    let query: Record<any, any> = {
        "players.userId": userId,
        "result": { $in: ["decisive", "draw"] },
        "gameSettings.status": { $in: ["finished"] }
    };

    let pattern = `user-${userId}-games-page:${page}-limit:${limit}`;

    // ===== Sort order ====== \\
    if (data.sortOrder)  {
        pattern = pattern + `-sortOrder-${data.sortOrder}`
    }

    // ===== Visbility ===== \\
    if (data.visibility) {
        query["gameSettings.visibility"] = data.visibility;
        pattern = pattern + `-visibility:${data.visibility}`
    };

    // ===== Preference ===== \\
    if (data.preference) {
        query["players.preference"] = data.preference;
        pattern = pattern + `-preference:${data.preference}`
    };

    // ===== Metric ===== \\ 
    if (data.metric && (["wins", "losses", "draws"]).includes(data.metric)) {

        // Metrics
        if (data.metric === "wins") {
            query["winner"] = userId;
            query["result"] = "decisive";
        }
        else if (data.metric === "losses") {
            query["winner"] = { $ne: userId };
            query["result"] = "decisive"
        } else {
            query["winner"] = null
            query["result"] = "draw";
        };

        pattern = pattern + `-metric:${data.metric}`
    };

    try {
        const cachedGames = await redisService.readOperation(pattern);

        if (!cachedGames) {
            // ===== Cache miss ===== \\        
            const totalGames = await gameService.countGameDocs(query);
            const totalPages = Math.ceil(totalGames / limit);

            // Get games
            const games = await gameService.getBulkOrSingleGame<BulkGamesLean>({
                result: "bulk",
                query,
                paginationConfig: {
                    limit,
                    offset,
                    sortOrder: data.sortOrder,
                    sortFields: ["finishedAt"]
                },
                populateOptions: [
                    {
                        path: "players.userId",
                        select: "username"
                    },
                ],
                selectFields: "players moves finishedAt winner result",
            }) as BulkGamesLean;


            // Format the games to match structure displayed to client
            const formattedGames: GameData[] = games.map((game) => {
                return {
                    _id: game._id.toString(),
                    players: game.players.map((player) => {
                        return {
                            _id: player.userId._id.toString(),
                            preference: player.preference,
                            username: player.userId.username,
                        }
                    }),
                    requestedUserInGameStatus:
                        (game.result === "decisive" && (game.winner?.toString() === userId)) ? "Won" :
                            (game.result === "decisive" && (game.winner?.toString() !== userId)) ? "Loss" : "Draw",
                    moves: game.moves.length,
                    finishedAt: (game.finishedAt?.toISOString()),
                };
            });

            // Prepare cache data
            const gamesData = ({
                totalGames,
                totalPages,
                page,
                limit,
                games: formattedGames
            });

            // Cache the data
            await redisService.writeOperation<GamesPayload>(pattern, gamesData, 180); // 3 minutes

            return res.status(200).json({
                success: true,
                message: "Games have been fetched successfully",
                data: gamesData,
            })
        } else {
            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "Games have been fetched successfully",
                data: { ...(JSON.parse(cachedGames)) } as GamesPayload
            })
        }
    } catch (err) {
        console.error(`Games fetch error\nFile: game.controllers.ts\nController: getGamesController\n${(err as any)?.stack}`);
        serverError(res, "Failed to fetch games", err);
    }
}


export const getBannerLiveGameController = async (req: Request, res: ConfiguredResponse) => {

    // Extract the user's id
    const userId = (req as ConfiguredRequest).accessTokenPayload.userId;
    const key = `user:${userId}-banner-game`;
    try {
        const cahchedLiveBannerGameId = await redisService.readOperation(key);

        if (!cahchedLiveBannerGameId) {
            const game = await gameService.getBulkOrSingleGame<({
                _id: mongoose.Types.ObjectId
            }) | null>({
                result: "single",
                optionConfig: ({ optionType: "exists" }),
                query: ({
                    "gameSettings.status": { $in: ["active"] },
                    "result": { $in: ["pending"] },
                    "players.userId": userId,
                }),
            }) as ({ _id: mongoose.Types.ObjectId }) | null;

            if (!game)
                return res.status(404).json({
                    success: false,
                    message: "Game does not exist or you are currently not in any active games",
                    error: ({ code: "NOT_FOUND", statusCode: 404 })
                });

            // Store it in redis for 3 minutes
            await redisService.writeOperation(key, game._id.toString());

            return res.status(200).json({
                success: true,
                message: "Banner live game has been fetched successfully",
                data: ({ bannerLiveGameId: game._id.toString() })
            })
        }

        return res.status(200).json({
            success: true,
            message: "Banner live game has been fetched successfully",
            data: ({ bannerLiveGameId: cahchedLiveBannerGameId })
        });
    } catch (err) {
        console.error(`Banner live game fetch error\nFile: game.controllers.ts\nController: getGamesController`);
        serverError(res, "Failed to fetch banner live game, please try again shortly", err);
    }
}