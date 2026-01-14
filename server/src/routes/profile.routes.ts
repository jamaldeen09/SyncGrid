import express from "express"
import { processValidationMiddleware, verifyAccessTokenMiddleware } from "../middlewares/auth.middlewares.js";
import { getProfileController } from "../controllers/profile.controllers.js";
import { validateId } from "../lib/validations/id.validation.js";
export const profileRouter: express.Router = express.Router();


// ===== Fetches the requesting user's profile ===== \\
profileRouter.get(
    "/me",
    verifyAccessTokenMiddleware,
    getProfileController("requesting-user"),
);


// ====== Fetches another user's profile ===== \\
profileRouter.get(
    "/:userId",
    verifyAccessTokenMiddleware,
    validateId("userId"),
    processValidationMiddleware,
    getProfileController("requested-user"),
) 