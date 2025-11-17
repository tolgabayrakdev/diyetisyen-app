import express from "express";
import StatisticsController from "../controller/statistics-controller.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const statisticsController = new StatisticsController();

router.get("/statistics", verifyToken, statisticsController.getStatistics.bind(statisticsController));

export default router;

