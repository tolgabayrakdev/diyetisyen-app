import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import DietPlanMealController from "../controller/diet-plan-meal-controller.js";

const router = express.Router();
const dietPlanMealController = new DietPlanMealController();

router.post("/diet-plans/:dietPlanId/meals", verifyToken, dietPlanMealController.createMeal.bind(dietPlanMealController));
router.get("/diet-plans/:dietPlanId/meals", verifyToken, dietPlanMealController.getMeals.bind(dietPlanMealController));
router.get("/meals/:id", verifyToken, dietPlanMealController.getMealById.bind(dietPlanMealController));
router.put("/meals/:id", verifyToken, dietPlanMealController.updateMeal.bind(dietPlanMealController));
router.delete("/meals/:id", verifyToken, dietPlanMealController.deleteMeal.bind(dietPlanMealController));

export default router;

