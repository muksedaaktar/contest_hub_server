import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/role.js";
import {
  getAllUsers,
  updateUserRole,
  updateUserProfile,
  getUserContests
} from "../controllers/userController.js";

const router = express.Router();

// Admin: get all users
router.get("/", authMiddleware, permit("admin"), getAllUsers);

// Admin: change user role
router.put("/role/:userId", authMiddleware, permit("admin"), updateUserRole);

// Normal user: update own profile
router.put("/profile", authMiddleware, updateUserProfile);

// Normal user: see participated & won contests
router.get("/my-contests", authMiddleware, getUserContests);

export default router;
