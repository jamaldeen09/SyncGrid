import express, { NextFunction, Request, Response } from "express"
import { processValidationMiddleware, verifyAccessTokenMiddleware } from "../middlewares/auth.middlewares.js";
import { getGamesValidation } from "../lib/validations/game.validations.js";
import { getBannerLiveGameController, getGameController, getGamesController } from "../controllers/game.controllers.js";
import { Game } from "../models/Game.js";
import { validateId } from "../lib/validations/id.validation.js";
export const gameRouter: express.Router = express.Router();


// ===== Fetch games (paginated) ===== \\
gameRouter.get(
    "/games/:userId",
    [...(validateId("userId")), ...getGamesValidation],
    processValidationMiddleware,
    getGamesController,
);

// ===== Get game ===== \\
gameRouter.get(
    "/game/:gameId",
    validateId("gameId"),
    processValidationMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        const gameType = req.query.gameType as "live-game" | "finished-game"

        // Only allow authenticated users to view their live games
        if (gameType === "live-game") 
            return verifyAccessTokenMiddleware(req, res, next);

        // Move on
        next();
    },
    getGameController,
);


// ===== Get banner live game ===== \\
gameRouter.get(
    "/banner/game",
    verifyAccessTokenMiddleware,
    getBannerLiveGameController,
)

gameRouter.delete(
    "/games/active",
    async (req, res) => {
        return res.json(await Game.deleteMany({ "gameSettings.status": "active" }))
    }
)

// ===== Fetch all games (no pagination pure testing) ===== \\
gameRouter.get(
    "/gamesi/see-all",
    async (req, res) => {
        return res.json(await Game.find());
    }
)

gameRouter.delete(
    "/games/all",
    async (req, res) => {
        return res.json(await Game.deleteMany())
    }
)