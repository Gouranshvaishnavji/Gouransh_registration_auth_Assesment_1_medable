import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
const env = require('../config/env');
export const protect = (req, res, next) => {
  try {
    let token;

    // Check cookie or Bearer token
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new AppError("Not authorized", 401);

    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};