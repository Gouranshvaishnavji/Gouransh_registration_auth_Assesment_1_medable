import AppError from "../utils/AppError.js";

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }
    next();
  };
};
