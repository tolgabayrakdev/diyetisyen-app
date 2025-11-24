import express from "express";
import FeedbackController from "../controller/feedback-controller.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const feedbackController = new FeedbackController();

router.post("/feedback", verifyToken, feedbackController.sendFeedback.bind(feedbackController));

export default router;

