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

// Shared email schema
const email = Joi.string()
  .email({ tlds: { allow: false } }) // no need to validate TLDs like ".com"
  .max(100) // prevent oversized input
  .required();

// Shared password schema
const password = Joi.string()
  .min(8) // at least 8 chars
  .max(64) // prevent huge payloads
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
  )
  .message(
    "Password must include at least one uppercase, one lowercase, one number, and one special character"
  )
  .required();
// Registration schema
export const registerSchema = Joi.object({
  email,
  password,
  name: Joi.string().max(50).trim().required(),
  role: Joi.string().valid("user", "admin").default("user") // no arbitrary role injection
}).unknown(false); // disallow extra keys (object injection protection)

// Login schema
export const loginSchema = Joi.object({
  email,
  password
}).unknown(false);
