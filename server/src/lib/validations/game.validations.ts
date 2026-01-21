import { body, query } from 'express-validator';

export const gameCreationValidation = [
  body("preference")
    .isIn(["X", "O"])
    .withMessage("Your play preference must be X or O")
];


export const getGamesValidation = [
  query("preference")
    .optional()
    .isIn(["X", "O"])
    .withMessage("Your play preference must be X or O"),

  query("visibility")
    .optional()
    .isIn(["public", "canceled"])
    .withMessage("Visibility can only be public or canceled"),

  query("metric")
    .optional()
    .isIn(["wins", "losses", "draws"])
    .withMessage("Metric can only be: wins, losses or draws"),

  query("sortOrder")
    .optional()
    .isIn(["newest_to_oldest" , "oldest_to_newest"])
    .withMessage("Sort order can only be: newest_to_oldest or oldest_to_newest"),

  query("page")
    .optional()
    .customSanitizer((val: string) => {
      const pageConvertedToNum = parseInt(val.trim());
      if (isNaN(pageConvertedToNum))
        throw new Error("Page must be a number")

      return pageConvertedToNum
    }),

  query("limit")
    .optional()
    .customSanitizer((val: string) => {
      const limitConvertedToNum = parseInt(val.trim());
      if (isNaN(limitConvertedToNum))
        throw new Error("Limit must be a number");

      return limitConvertedToNum
    })
]
