import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import AIController from "../controller/ai-controller.js";

const router = express.Router();
const aiController = new AIController();

// Kilo değişimi özeti
router.get(
    "/clients/:clientId/ai/weight-summary",
    verifyToken,
    aiController.summarizeWeightChange.bind(aiController)
);

// Haftalık ilerleme yorumu
router.get(
    "/clients/:clientId/ai/weekly-comment",
    verifyToken,
    aiController.commentWeeklyProgress.bind(aiController)
);

export default router;

