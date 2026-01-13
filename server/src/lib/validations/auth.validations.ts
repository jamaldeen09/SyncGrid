import { body } from "express-validator";

export const signupValidation = [
    body("email")
        .notEmpty()
        .withMessage("An email address must be provided")
        .isEmail()
        .withMessage("Invalid email address"),

    body("username")
        .notEmpty()
        .withMessage("A username must be provided")
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

    body("password")
        .notEmpty()
        .withMessage("A password must be provided")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 })
        .withMessage("Password cannot exceed 30 characters")
        .matches(/(?=.*[a-z])/)
        .withMessage("Password must have at least 1 lowercase character")
        .matches(/[^a-zA-Z0-9<>&;]/)
        .withMessage("Password must contain at least 1 special character (excluding HTML tags)")
        // .matches(/<[^>]*>/)
        // .withMessage("Password cannot contain html tags")
];


export const loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("An email address must be provided")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .notEmpty()
        .withMessage("A password must be provided")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 })
        .withMessage("Password cannot exceed 30 characters")
        .matches(/(?=.*[a-z])/)
        .withMessage("Password must have at least 1 lowercase character")
        .matches(/[^a-zA-Z0-9<>&;]/)
        .withMessage("Password must contain at least 1 special character (excluding HTML tags)")
]