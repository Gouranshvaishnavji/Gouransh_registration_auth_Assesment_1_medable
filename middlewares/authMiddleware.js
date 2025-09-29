import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import env from '../config/env.js';
const authMiddleware = (req, res, next) => {
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
    
    // Store user info in both req.user and res.locals for flexible access
    const userData = {
      id: decoded.id,
      role: decoded.role,
      isAdmin: decoded.role === 'admin'
    };

    // Add to req.user for middleware compatibility
    req.user = userData;
    
    // Add to res.locals for template/view access
    res.locals.user = userData;
    res.locals.isAuthenticated = true;
    res.locals.isAdmin = userData.isAdmin;

    next();
  } catch (error) {
    // Clear any existing auth data
    res.locals.user = null;
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token provided', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Session expired, please login again', 401));
    }

    next(new AppError('Authentication failed', 401));
  }
};
export default authMiddleware;