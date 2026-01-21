import { body, param } from "express-validator";

export const getProfileValidation = [
    param("username")
        .notEmpty()
        .withMessage("A username must be provided")
];


export const editProfileValidation = [
    body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Bio cannot exceed 50 characters"),

    body("username")
        .optional()
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 1 })
        .withMessage("Username must be at least 1 character")
        .isLength({ max: 39 })
        .withMessage("Username cannot exceed 39 characters")
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage("Username must only contain letters, numbers, or hyphens")
        .matches(/^(?!-)/)
        .withMessage("Username cannot begin with a hyphen")
        .matches(/(?<!-)$/)
        .withMessage("Username cannot end with a hyphen")
        .matches(/(?!.*--.*)/)
        .withMessage("Username cannot have consecutive hyphens"),
];