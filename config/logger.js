/**
 * @file logger.js
 * @description Central Winston logger configuration.
 * Provides transports for console (dev) and log files (combined + errors).
 * Used by request logger and error handler across the application.
 */

import winston from "winston";
import path from "path";
import env from "./env.js";

// Ensure absolute path for logs directory
const logDir = path.resolve(process.cwd(), env.LOG_DIR || "logs");

// Log format: JSON in production, pretty in development
const logFormat =
  env.NODE_ENV === "production"
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ""
            }`
        )
      );

const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // File logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// In dev, log to console too
if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
export default logger;
