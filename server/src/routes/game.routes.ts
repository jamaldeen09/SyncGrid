import { createGameController, getGamesController } from '../controllers/game.controllers.js';
import { gameCreationValidation, getCreatedGamesValidation } from '../lib/validations/game.validations.js';
import { processValidationMiddleware, verifyAccessTokenMiddleware } from './../middlewares/auth.middlewares.js';
import express from "express"
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
    getCreatedGamesValidation,
    processValidationMiddleware,
    getGamesController,
)