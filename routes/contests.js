import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/role.js";
import { addContest, approveContest, declareWinner } from "../controllers/contestController.js";

const router = express.Router();

router.post("/", authMiddleware, permit("creator"), addContest);
router.put("/approve", authMiddleware, permit("admin"), approveContest);
router.put("/declare-winner", authMiddleware, permit("creator"), declareWinner);

export default router;
