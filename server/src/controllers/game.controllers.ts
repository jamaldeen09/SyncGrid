import { Request } from 'express';
import { serverError } from '../services/auth.services.js';
import { ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { FinishedGameData, GameData, GamesPayload, GetGamesData } from '@shared/index.js';
import { GameService } from '../services/game.service.js';
import { RedisService } from '../services/redis.service.js';
import { BulkGamesLean, FinishedGameLean } from '../types/game.types.js';
import mongoose from 'mongoose';

// Game service
const gameService = new GameService();

// Redis service
const redisService = new RedisService();


export const getGameController = async (req: Request, res: ConfiguredResponse) => {

    // Extract the user's id 
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    // Extract the game id attached to request
    const { gameId } = (req as ConfiguredRequest).data as { gameId: string };

    // Finished game cache key
    const key = `finished-game:${gameId}`;

    try {
        const cachedGame = await redisService.readOperation(key);

        if (!cachedGame) {
            // ===== Cache miss ===== \\
            const game = await gameService.getBulkOrSingleGame<FinishedGameLean>({
                result: "single",
                optionConfig: { optionType: "find", option: "via-id" },
                id: gameId,
                selectFields: "players gameSettings moves",
                populateOptions: {
                    path: "players.userId",
                    select: "_id username profileUrl currentWinStreak"
                }
            }) as FinishedGameLean;
    
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
    
            // Check if the game is active 
            // if so check if the requesting user is a player in this game
            if (
                (game.gameSettings.status === "active") && (!game.players.some((player) => player.userId._id.toString() == userId)))
                return res.status(403).json({
                    success: false,
                    message: "You do not have the permission to view this game",
                    error: {
                        code: "NOT_ALLOWED",
                        statusCode: 403,
                    }
                });
    

            // Prepare data to send to frontend
            const finishedGameData: FinishedGameData = {
                ...game,
                _id: game._id.toString(),
                players: game.players.map((player) => ({
                    ...player.userId,
                    userId: player.userId._id.toString(),
                    preference: player.preference,
                })),
                moves: game.moves.map((move) => ({
                    playedBy: move.playedBy.toString(),
                    value: move.value,
                    boardLocation: move.boardLocation,
                })),
            };

            // Cache the game for 5 minutes
            await redisService.writeOperation<FinishedGameData>(key, finishedGameData, 300);

            return res.status(200).json({
                success: true,
                message: "Game has been fetched successfully",
                data: { game: finishedGameData }
            });
        } else {
            // ===== Cache hit ===== \\
            return res.status(200).json({
                success: true,
                message: "Game has been fetched successfully",
                data: { game: JSON.parse(cachedGame) }
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
                    sortOrder: data.sortOrder
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
                        (game.result === "decisive" && (game.winner.toString() === userId)) ? "Won" :
                            (game.result === "decisive" && (game.winner.toString() !== userId)) ? "Loss" : "Draw",
                    moves: game.moves.length,
                    finishedAt: (game.finishedAt?.toISOString() || new Date().toISOString()),
                };
            });

            // Prepare cache data
            const gamesData = {
                totalGames,
                totalPages,
                page,
                limit,
                games: formattedGames
            };

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
        console.error(`Games fetch error\nFile: game.controllers.ts\nController: getGamesController\n${err}`);
        serverError(res, "Failed to fetch games", err);
    }
}