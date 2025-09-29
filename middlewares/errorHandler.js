// const env = require('../config/env');
// function errorHandler(err, req, res, next) {
//   console.error(err); // replace with logger later

//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";

//   res.status(statusCode).json({
//     success: false,
//     message,
//     ...(env.NODE_ENV === "development" && { stack: err.stack })
//   });
// }

// export default errorHandler;
/**
 * @file errorHandler.js
 * @description Centralized error-handling middleware.
 * Catches AppError or system errors, logs them via Winston,
 * and sends a clean JSON response to the client.
 */

import env from "../config/env.js";
import logger from "../config/logger.js";

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error details (with request ID if available)
  logger.error({
    message,
    statusCode,
    requestId: req.id || "N/A",
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id || undefined, // helps track errors in logs
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default errorHandler;
