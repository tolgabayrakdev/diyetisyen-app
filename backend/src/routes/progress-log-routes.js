import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import ProgressLogController from "../controller/progress-log-controller.js";

const router = express.Router();
const progressLogController = new ProgressLogController();

router.post("/clients/:clientId/progress-logs", verifyToken, progressLogController.createLog.bind(progressLogController));
router.get("/clients/:clientId/progress-logs", verifyToken, progressLogController.getLogs.bind(progressLogController));
router.get("/progress-logs/:id", verifyToken, progressLogController.getLogById.bind(progressLogController));
router.put("/progress-logs/:id", verifyToken, progressLogController.updateLog.bind(progressLogController));
router.delete("/progress-logs/:id", verifyToken, progressLogController.deleteLog.bind(progressLogController));

export default router;

