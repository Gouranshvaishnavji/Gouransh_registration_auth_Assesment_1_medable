/**
 * Auth Controller
 * ------------------------------------
 * Handles authentication and registration business logic.
 * Fixes bugs:
 * - Prevents password exposure in API responses
 * - Hashes passwords securely before saving
 * 
 * Responsibilities:
 * - Register new users (with validation and hashing)
 * - (Later) Handle login, JWT token generation, password changes, etc.
 * 
 * Works with:
 * - models/users.js as the centralized user store
 * - utils/AppError.js for error handling
 * - middlewares/validate.js for request validation
 */

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import users from "../models/users.js"; 
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
const env = require('../config/env');
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // check if user exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || "Unknown User",
      role: "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const { password: _, ...safeUser } = newUser; // remove password

    res.status(201).json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) throw new AppError("Invalid credentials", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1h" } //1 hour is most common
    );

    // Set cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1hr as token 
    });

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      token, // also I can return it for clients that don’t use cookies
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
