import express from "express"
import { loginValidation, signupValidation } from "../lib/validations/auth.validations.js";
import { 
    checkUsernameAvailabilityMiddleware, 
    processValidationMiddleware, 
    verifyAccessTokenMiddleware, 
    verifyRefreshTokenMiddleware 
} from "../middlewares/auth.middlewares.js";
import { 
    getSessionController, 
    loginController, 
    logoutController, 
    refreshController, 
    signupController 
} from "../controllers/auth.controllers.js";
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


// ===== Session fetch route ===== \\
authRouter.get(
    "/session",
    verifyAccessTokenMiddleware,
    getSessionController,
);


// ===== Token refresh route ===== \\
authRouter.get(
    "/refresh",
    verifyRefreshTokenMiddleware,
    refreshController,
);


// ===== Logout route ===== \\
authRouter.post(
    "/logout",
    verifyAccessTokenMiddleware,
    logoutController
);
