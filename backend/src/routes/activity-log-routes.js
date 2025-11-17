import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import ActivityLogController from "../controller/activity-log-controller.js";

const router = express.Router();
const activityLogController = new ActivityLogController();

router.get("/activity-logs", verifyToken, activityLogController.getLogs.bind(activityLogController));
router.get("/activity-logs/:id", verifyToken, activityLogController.getLogById.bind(activityLogController));
router.get("/activity-logs/entity/:entityType", verifyToken, activityLogController.getLogsByEntity.bind(activityLogController));

export default router;

