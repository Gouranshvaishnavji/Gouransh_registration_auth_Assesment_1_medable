/**
 * Auth Validation Schemas (Joi)
 * -----------------------------------------------------------------------------------------------------------------------
 * defines input validation rules for authentication endpoints.
 * fixes the bug: "No Input Validation" (from README).
 * 
 * Responsibilities:
 * - Ensure emails follow correct format
 * - Enforce strong password policy (uppercase, lowercase, number, special char)
 * - Validate optional fields (like name) with length restrictions
 * 
 * These schemas are used by middleware before hitting controllers,
 * preventing invalid requests from reaching business logic.
 */
import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disable TLD check to allow test emails
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "any.required": "Password is required",
    }),

  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be less than 50 characters",
    }),
});

