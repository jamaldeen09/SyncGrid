import express from "express"
import { verifyAccessTokenMiddleware } from "../middlewares/auth.middlewares.js";
import { getProfileController } from "../controllers/profile.controllers.js";
export const profileRouter: express.Router = express.Router();

// ===== Get profile data ===== \\
profileRouter.get(
    "/me",
    verifyAccessTokenMiddleware,
    getProfileController,
)