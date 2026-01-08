import { NextFunction, Request } from "express";
import { ConfiguredRequest, ConfiguredResponse } from "../types/auth.types.js";
import { User } from "../models/User.js";
import { Game, IGame } from "../models/Game.js";

export const checkGameUpdateEligibilityMiddleware = async (req: Request, res: ConfiguredResponse, next: NextFunction) => {
    // Extract the user's id attached to request
    const { userId } = (req as ConfiguredRequest).accessTokenPayload;

    // Extract the validated gameId from request
    const { gameId } = (req as ConfiguredRequest).data as { gameId: string };

    try {
        // Check if the game the user is trying to update exists
        const game = await Game.findById(gameId).lean<IGame>();

        if (!game)
            return res.status(404).json({
                success: false,
                message: "The game you are trying to update was not found",
                error: {
                    code: "NOT_FOUND",
                    statusCode: 404,
                },
            });

        // Check if the user trying to update the game is the creator of the game 
        // and check if the game's status is created
        const isEligible = game.creator.toString() === userId && game.game_settings.status === "created";

        if (!isEligible)
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this game",
                error: {
                    code: "FORBIDDEN",
                    statusCode: 403,
                }
            });

        // Attach the id of the game the client wishes to delete/update to request
        // for easy usage in controllers/middlewares after this one
        (req as ConfiguredRequest).game = game;

        // Attach user's id as well
        (req as ConfiguredRequest).userId = userId;
        next()
    } catch (err) {
        console.error(`***** Game manipulation eligibility check error *****\nFile: game.middlewares.ts\nMiddleware: checkGameUpdateEligibilityMiddleware\n${err}`);
        return res.status(500).json({
            success: false,
            message: "A server error occured while trying to update your requested game, please try again shortly",
            error: {
                code: "SERVER_ERROR",
                statusCode: 500,
            }
        });
    }
}