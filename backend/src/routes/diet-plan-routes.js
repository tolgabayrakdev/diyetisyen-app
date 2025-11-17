import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import DietPlanController from "../controller/diet-plan-controller.js";

const router = express.Router();
const dietPlanController = new DietPlanController();

router.post("/clients/:clientId/diet-plans", verifyToken, dietPlanController.createDietPlan.bind(dietPlanController));
router.get("/clients/:clientId/diet-plans", verifyToken, dietPlanController.getDietPlans.bind(dietPlanController));
router.get("/diet-plans/:id", verifyToken, dietPlanController.getDietPlanById.bind(dietPlanController));
router.put("/diet-plans/:id", verifyToken, dietPlanController.updateDietPlan.bind(dietPlanController));
router.delete("/diet-plans/:id", verifyToken, dietPlanController.deleteDietPlan.bind(dietPlanController));

export default router;

