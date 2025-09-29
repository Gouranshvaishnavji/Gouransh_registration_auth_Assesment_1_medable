// const env = require('../../config/env');
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');
// const validator = require('validator');

// const router = express.Router();

// // In-memory user storage (simulate database)
// let users = [
//   {
//     id: '1',
//     email: 'admin@test.com',
//     password: '$2a$10$8K1p/a0dCVIRRqL.Qk0mce7LzYVbKuLyZg.3/t.NzXo/1UhqKqYxa', // 'admin123'
//     name: 'Admin User',
//     role: 'admin',
//     createdAt: new Date('2024-01-01').toISOString()
//   },
//   {
//     id: '2',
//     email: 'user@test.com', 
//     password: '$2a$10$qHT2AjOcNsXJKPc4G8/yte1FOjTxKqYfCYh2KNF9xD8FbhPi0qO8u', // 'user123'
//     name: 'Regular User',
//     role: 'user',
//     createdAt: new Date('2024-01-02').toISOString()
//   }
// ];

// const JWT_SECRET = env.JWT_SECRET
// // Login endpoint
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // BUG: Missing input validation - zod, sanitisation //
//     const user = users.find(u => u.email === email);
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // BUG: Not awaiting bcrypt.compare
//     const validPassword = bcrypt.compare(password, user.password);
    
//     if (!validPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.set('X-Hidden-Hint', 'check_the_response_headers_for_clues');
    
//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Register endpoint
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
    
//     // BUG: Incomplete validation
//     if (!email || !password ) {  // it should also check name, role //
//       return res.status(400).json({ error: 'Email and password required' });
//     }

//     // BUG: Not checking if email is valid format - zod, sanitisation //
//     const existingUser = users.find(u => u.email === email);
    
//     if (existingUser) {
//       return res.status(409).json({ error: 'User already exists' });
//     }

//     // BUG: Password should be validated for strength// - zod, sanitisation //
//     if (password.length < 6) {
//       return res.status(400).json({ error: 'Password too short' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10); // make it 12, also link why 12. //
    
//     const newUser = {
//       id: uuidv4(),
//       email,
//       password: hashedPassword,
//       name: name || 'Unknown User',
//       role: 'user', // BUG: Should not be hardcoded, should validate role,// default to 'user', worthy to be praised //
//       createdAt: new Date().toISOString()
//     };

//     users.push(newUser);

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         name: newUser.name,
//         role: newUser.role
//       }
//     });
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = authRouter;
import express from "express";
import {login, register } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { registerSchema } from "../validators/authValidator.js";

const router = express.Router();

/*
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@test.com
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: newuser@test.com
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Invalid input (e.g., email already in use)
 */

router.post("/register", validate(registerSchema), register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Successful login
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: user@test.com
 *                     role:
 *                       type: string
 *                       example: user
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

export default router;
