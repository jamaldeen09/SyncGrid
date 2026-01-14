import { param } from "express-validator"

/**
 * Validates an id
 * @param field 
 */
export const validateId = (field: string) => {
    return [
        param(field)
          .notEmpty()
          .withMessage(`${field} must be provided`)
          .trim()
          .isString()
          .withMessage(`${field} must be a string`)
          .isLength({ min: 24, max: 24 })
          .withMessage(`${field} must be exactly 24 characters`)
    ]
}