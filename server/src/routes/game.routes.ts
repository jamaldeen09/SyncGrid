import express from "express"
import { processValidationMiddleware, verifyAccessTokenMiddleware } from "../middlewares/auth.middlewares.js";
import { getGamesValidation } from "../lib/validations/game.validations.js";
import { getGameController, getGamesController } from "../controllers/game.controllers.js";
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
    verifyAccessTokenMiddleware,
    getGameController,
);

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