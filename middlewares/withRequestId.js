/**
 * @file withRequestId.js
 * @description Middleware that attaches a unique request ID to each request.
 * Adds `req.requestId` and sets "X-Request-Id" response header.
 * Also attaches a child logger (`req.logger`) scoped with the requestId.
 */

import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";

const withRequestId = (req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  // Attach a request-scoped logger
  req.logger = logger.child({ requestId });

  next();
};

export default withRequestId;
