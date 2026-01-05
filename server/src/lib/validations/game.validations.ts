import { body, query } from 'express-validator';


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

export const getCreatedGamesValidation = [
    query("page")
        .optional()
        .customSanitizer((val) => {
            if (!val) return val;
            const num = Number(val);
            return isNaN(num) ? val : num;
        })
        .isNumeric()
        .withMessage("Page must be a number"),

    query("status")
        .optional()
        .isIn(["matched", "in_queue", "finished", "created"])
        .withMessage("Status can only be:\n1. matched\n2. in_queue\n3. finished\n4. created"),

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

    query("sort_order")
        .optional()
        .isIn(["newest_first", "oldest_first"])
        .withMessage("Sort order can only be: newest_first or oldest_first"),

    query("play_as")
        .optional()
        .isIn(["X", "O"])
        .withMessage("Play as value must be X or O"),

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