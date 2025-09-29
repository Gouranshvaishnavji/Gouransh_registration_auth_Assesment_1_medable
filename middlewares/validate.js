/**
 * @file validate.js
 * @description using joi to validate request bodies against defined schemas.
 */

import AppError from "../utils/AppError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false }); // abortEarly false is to get all errors

    if (error) {
      // return first error (or collect all if needed)
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    // replacing req.body with sanitized values
    req.body = value;
    next();
  };
};
export default validate;