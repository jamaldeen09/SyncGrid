import { NextFunction, Request } from 'express';
import { serverError } from '../services/auth.services.js';
import { gameService } from '../services/game.service.js';
import { ConfiguredRequest, ConfiguredResponse } from '../types/api.types.js';
import { ExistsQueryLean } from '../types/db-service.types.js';
import { IGame } from '../models/Game.js';

export const checkForInQueueGameMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    try {
        const game = await gameService.getBulkOrSingleGame<ExistsQueryLean>({
            result: "single",
            optionConfig: { optionType: "exists" },
            query: {
                "players.userId": userId, // check if the user is a player in the game
                status: "in_queue" // check if the status is "in_queue to determine if it is in a queue"
            },
        }) as ExistsQueryLean;

        if (game)
            return res.status(403).json({
                success: false,
                message: "You cannot create a game yet because you already have a game in the matchmaking queue",
                error: {
                    code: "NOT_ALLOWED",
                    statusCode: 403,
                }
            });

        // Next operation
        next();
    } catch (err) {
        console.error(`In queue game check error\nFile: game.middlewares.ts\nMiddleware: checkForInQueueGameMiddleware\n${err}`);
        serverError(res, "A server error occured while trying to check if you can create a game, please try again shortly", err);
    }
}

export const checkGameManipulationPermissionsMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;
    const { gameId } = (req as ConfiguredRequest).data as { gameId: string };

    try {
        const game = await gameService.getBulkOrSingleGame<IGame | null>({
            result: "single",
            optionConfig: { optionType: "find", option: "via-id" },
            id: gameId,
            selectFields: "gameSettings players moves creator winner durationMs finishedAt cancelationReason canceledAt createdAt updatedAt"
        }) as IGame | null;

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

        // Check if the person trying to manipulate the game
        // is the creator of the game

        // Also check if the game's status is "created"
        // because that is the only type of game that can be updated
        const isElibigle = game.players.some((player) => player.userId.toString() === userId) && game.gameSettings.status === "finished";

        if (!isElibigle)
            return res.status(403).json({
                success: false,
                message: "You do not have permission to manipulate this game",
                error: {
                    code: "NOT_ALLOWED",
                    statusCode: 403,
                }
            });


        // Attach game to request for usage in other controllers
        // or middlewares
        (req as ConfiguredRequest).game = game;
        next();
    } catch (err) {
        console.error(`Game manipulation permission check error\nFile: game.middlewares.ts\nMiddleware: checkGameManipulationPermissionsMiddleware\n${err}`);
        serverError(res, "A server error occured while trying to check your permissions for this game, please try again shortly", err)
    }
}