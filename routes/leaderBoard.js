import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getLeaderboard } from "../controllers/leaderBoardController.js";

const router = express.Router();

router.get("/", authMiddleware, getLeaderboard);

export default router;
