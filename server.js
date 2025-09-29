import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import env from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './config/logger.js';
// Import routes
import authRoutes from './https/routes/authRoutes.js';
import userRoutes from './https/routes/userRoutes.js';
import secretStatsRoutes from './https/routes/secret-stats.js';

const app = express();
const PORT = env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Custom headers for puzzle hints
app.use((req, res, next) => {
  res.set({
    'X-Secret-Challenge': 'find_me_if_you_can_2024',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  next();
});
// Routes

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/secret-stats', secretStatsRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


// Error handler
app.use(errorHandler);

// Handle uncaught/unhandled
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});
app.listen(PORT, () => {
  console.log(`🔐 Assessment 1: User Management API running on http://localhost:${PORT}`);
  console.log(`📋 View instructions: http://localhost:${PORT}`);
  console.log(`🧩 Ready for puzzle solving!`);
});
