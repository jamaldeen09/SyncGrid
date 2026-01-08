import { body, param, query } from 'express-validator';


export const gameCreationValidation = [
    body("time_setting_ms")
        .notEmpty()
        .withMessage("A time setting for your game must be provided")
        .isIn([30000, 60000, 120000, 180000])
        .withMessage("Time setting must be: 30 seconds, 1 minute, 2 minutes or 3 minutes"),

    body("visibility")
        .notEmpty()
        .withMessage("The visibility for your game must be provided")
        .trim()
        .isIn(["private", "public"])
        .withMessage("The visibility for your game can only be private or public"),

    body("disabled_comments")
        .isBoolean()
        .withMessage(`Please provide true/false for the setting: disabled_comments`),

    body("play_as_preference")
        .notEmpty()
        .withMessage("Please provide what you would like to play as in your game")
        .trim()
        .isIn(["X", "O"])
        .withMessage("You must choose to play as X or O")
]

export const gameUpdateValidation = [
    body("time_setting_ms")
        .optional()
        .notEmpty()
        .withMessage("A time setting for your game must be provided")
        .isIn([30000, 60000, 120000, 180000])
        .withMessage("Time setting must be: 30 seconds, 1 minute, 2 minutes or 3 minutes"),

    body("visibility")
        .optional()
        .notEmpty()
        .withMessage("The visibility for your game must be provided")
        .trim()
        .isIn(["private", "public"])
        .withMessage("The visibility for your game can only be private or public"),

    body("disabled_comments")
        .optional()
        .isBoolean()
        .withMessage(`Please provide true/false for the setting: disabled_comments`),

    body("play_as_preference")
        .optional()
        .notEmpty()
        .withMessage("Please provide what you would like to play as in your game")
        .trim()
        .isIn(["X", "O"])
        .withMessage("You must choose to play as X or O")
]

export const getGamesValidation = [
    query("page")
        .optional()
        .customSanitizer((val) => {
            if (!val) return val;
            const num = Number(val);
            return isNaN(num) ? val : num;
        })
        .isNumeric()
        .withMessage("Page must be a number"),

    query("limit")
        .optional()
        .customSanitizer((val) => {
            if (!val) return val;
            const num = Number(val);
            return isNaN(num) ? val : num;
        })
        .isNumeric()
        .withMessage("Limit must be a number")
        .isLength({ max: 8 })
        .withMessage("Limit cannot exceed 8"),

    query("played_as")
        .optional()
        .isIn(["X", "O"])
        .withMessage("Played as value must be X or O"),

    query("disabled_comments")
        .optional()
        .customSanitizer((val) => {
            if (val === "true" || val === true) return true;
            if (val === "false" || val === false) return false;
            return val;
        })
        .isBoolean()
        .withMessage(`Please provide true/false for the filter: disabled_comments`),

    query("visibility")
        .optional()
        .isIn(["private", "public"])
        .withMessage("Visibility must be private or public"),

    query("time_setting_ms")
        .optional()
        .customSanitizer((val) => {
            if (!val) return val;
            const num = Number(val);
            return isNaN(num) ? val : num;
        })
        .isIn([30000, 60000, 120000, 180000])
        .withMessage("Time setting must be: 30 seconds, 1 minute, 2 minutes or 3 minutes")
]

export const gameIdValidation = [
    param("gameId")
        .notEmpty()
        .withMessage("Game id must be provided")
        .trim()
        .isString()
        .withMessage("Game id must be a string")
        .isLength({ min: 24, max: 24 })
        .withMessage("Game id must be exactly 24 characters")
]