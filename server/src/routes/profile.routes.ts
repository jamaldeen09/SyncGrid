import express from "express"
import { checkUsernameAvailabilityMiddleware, processValidationMiddleware, verifyAccessTokenMiddleware } from "../middlewares/auth.middlewares.js";
import { editProfileController, getProfileController, getRequestingUserProfileController } from "../controllers/profile.controllers.js";
import { editProfileValidation, getProfileValidation } from "../lib/validations/profile.validations.js";
import { parseFormData, profilePictureUpload } from "../middlewares/cloudinary.middlewares.js";
export const profileRouter: express.Router = express.Router();


// ====== Fetches a user's profile ===== \\
profileRouter.get(
    "/profile/public/:username",
    getProfileValidation,
    processValidationMiddleware,
    getProfileController,
) 

// ===== Fetches the requesting user's profile data ===== \\
profileRouter.get(
    "/profile/private",
    verifyAccessTokenMiddleware,
    getRequestingUserProfileController,
) 

// ===== Updates the requesting user's profile ===== \\
profileRouter.patch(
    "/profile",
    verifyAccessTokenMiddleware,
    parseFormData,
    editProfileValidation,
    processValidationMiddleware,
    checkUsernameAvailabilityMiddleware,
    profilePictureUpload,
    editProfileController,
)