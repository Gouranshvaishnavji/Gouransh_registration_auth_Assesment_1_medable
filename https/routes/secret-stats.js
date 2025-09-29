import env from "../../config/env.js";
import express from "express";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import authMiddleware from "../../middlewares/authMiddleware.js"
import requireRole from "../../middlewares/roleMiddleware.js";
const router = express.Router();
const JWT_SECRET = env.JWT_SECRET;

// Encoded secret message (Base64)
const SECRET_MESSAGE ="Q29uZ3JhdHVsYXRpb25zISBZb3UgZm91bmQgdGhlIHNlY3JldCBlbmRwb2ludC4gVGhlIGZpbmFsIGNsdWUgaXM6IFNIQ19IZWFkZXJfUHV6emxlXzIwMjQ=";



// Secret stats endpoint
router.get("/", authMiddleware, requireRole(["admin"]), async (req, res, next) => {
  try {
    const secretHeader = req.get("x-secret-challenge");
    const querySecret = req.query.secret;

    // Puzzle check: must provide correct header OR query
    if (
      secretHeader !== "find_me_if_you_can_2024" &&
      querySecret !== "admin_override"
    ) {
      return next(
        new AppError(
          "Access denied: Missing puzzle key. Hint: check headers or query params",
          403
        )
      );
    }

    // Must also be admin
    if (!req.user || req.user.role !== "admin") {
      return next(
        new AppError("Forbidden: Only admins can access secret stats", 403)
      );
    }

    const stats = {
      totalUsers: 2, // later replace with db length
      adminUsers: 1,
      regularUsers: 1,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      },
      secretMessage: Buffer.from(SECRET_MESSAGE, "base64").toString("utf-8"),
      timestamp: new Date().toISOString()
    };

    res.set({
      "X-Puzzle-Complete": "true",
      "X-Next-Challenge": "Find all the bugs in the authentication system",
      "Cache-Control": "no-cache"
    });

    res.json(stats);
  } catch (error) {
    next(new AppError("Internal server error", 500));
  }
});

export default router;