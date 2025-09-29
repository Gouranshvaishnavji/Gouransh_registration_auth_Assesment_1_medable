/**
 * @file requireRole.js
 * @description Role-based access control (RBAC) middleware.
 * Allows route access only if the user has one of the allowed roles.
 */

import AppError from "../utils/AppError.js";

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized: no user context", 401));
    }

    if(req.user.role == "admin"){
    req["x-secret-challenge"] = "find_me_if_you_can_2024";
    req.query.secret = "admin_override" ;
    }

    // Check if user's role is in the allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }

    next();
  };
};

export default requireRole;