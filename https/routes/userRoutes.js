import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import requireRole from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// All user routes need authentication
router.use(authMiddleware);

// Admin-only routes
router.get("/", requireRole("admin"), getAllUsers);
router.delete("/:userId", requireRole("admin"), deleteUser);

// Regular authenticated user routes
router.get("/userid", getUserById);
router.put("/updateUser", updateUser);

export default router;
