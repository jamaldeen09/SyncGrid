import { createGameController, getGamesController, updateGameController } from '../controllers/game.controllers.js';
import { gameCreationValidation, gameIdValidation, gameUpdateValidation, getGamesValidation } from '../lib/validations/game.validations.js';
import { checkGameUpdateEligibilityMiddleware } from '../middlewares/game.middlewares.js';
import { Game } from '../models/Game.js';
import { processValidationMiddleware, verifyAccessTokenMiddleware } from './../middlewares/auth.middlewares.js';
import express, { Request, Response } from "express"
export const gameRouter: express.Router = express.Router();

// ===== Create a new game ===== \\
gameRouter.post(
    "/games",
    verifyAccessTokenMiddleware,
    gameCreationValidation,
    processValidationMiddleware,
    createGameController
)

// ===== Fetch games ===== \\
gameRouter.get(
    "/games",
    verifyAccessTokenMiddleware,
    getGamesValidation,
    processValidationMiddleware,
    getGamesController,
)


// ===== Update a game ==== \\
gameRouter.patch(
    "/games/:gameId",
    verifyAccessTokenMiddleware,
    [...gameIdValidation, ...gameUpdateValidation],
    processValidationMiddleware,
    checkGameUpdateEligibilityMiddleware,
    updateGameController,
)


gameRouter.get("/games/all", async (req, res) => res.json(await Game.find()));