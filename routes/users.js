import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/role.js";
import {
  getAllUsers,
  updateUserRole,
  updateUserProfile,
  getUserContests,
  createUser 
} from "../controllers/userController.js";

const router = express.Router();

// Admin routes
router.get("/", authMiddleware, permit("admin"), getAllUsers);
router.patch("/role/:userId", authMiddleware, permit("admin"), updateUserRole);

// User routes
router.patch("/profile", authMiddleware, updateUserProfile);
router.get("/my-contests", authMiddleware, getUserContests);

// ✅ New POST route for registration (MongoDB save)
router.post("/", createUser);

export default router;
