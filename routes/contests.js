import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/role.js";
import {
  addContest,
  approveContest,
  declareWinner,
  getApprovedContests,
} from "../controllers/contestController.js";

const router = express.Router();

/* =========================
   CREATOR
========================= */
// Add new contest
router.post("/", authMiddleware, permit("creator"), addContest);

// Declare winner
router.patch(
  "/declare-winner",
  authMiddleware,
  permit("creator"),
  declareWinner
);

/* =========================
   ADMIN
========================= */
// Approve contest
router.patch(
  "/approve/:contestId",
  authMiddleware,
  permit("admin"),
  approveContest
);

/* =========================
   PUBLIC
========================= */
// Get approved contests
router.get("/", getApprovedContests);

export default router;
