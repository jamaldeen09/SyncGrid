import { getSessionController, loginController, refreshController, signupController } from '../controllers/auth.controllers.js';
import { checkUsernameAvailabilityMiddleware, processValidationMiddleware, verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware } from '../middlewares/auth.middlewares.js';
import { loginValidation, signupValidation } from './../lib/validations/auth.validations.js';
import express from "express"
export const authRouter: express.Router = express.Router();

// ===== Signup route ===== \\
authRouter.post(
    "/signup", 
    signupValidation, 
    processValidationMiddleware,
    checkUsernameAvailabilityMiddleware,
    signupController,
)

// ===== Login route ===== \\
authRouter.post(
    "/login",
    loginValidation,
    processValidationMiddleware,
    loginController,
)  

// ===== Get session route ===== \\
authRouter.get(
    "/session",
    verifyAccessTokenMiddleware,
    getSessionController,
)


// ===== Refresh access token route ===== \\
authRouter.get(
    "/refresh",
    verifyRefreshTokenMiddleware,
    refreshController,
)