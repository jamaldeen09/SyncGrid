import express, { Request, Response } from "express"
import { loginValidation, signupValidation } from "../lib/validations/auth.validations.js";
import { 
    checkUsernameAvailabilityMiddleware, 
    processValidationMiddleware, 
    verifyAccessTokenMiddleware, 
    verifyRefreshTokenMiddleware 
} from "../middlewares/auth.middlewares.js";
import { User } from "../models/User.js";
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


// ===== Quick actions routes ===== \\
authRouter.get(
    "/users",
    async (req: Request, res: Response) => {
        return res.json(await User.find())
    }
)

authRouter.delete(
    "/users",
    async (req: Request, res: Response) => {
        return res.json(await User.deleteMany());
    }
)