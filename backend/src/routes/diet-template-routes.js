import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import DietTemplateController from "../controller/diet-template-controller.js";

const router = express.Router();
const dietTemplateController = new DietTemplateController();

// Şablon CRUD işlemleri
router.post("/", verifyToken, dietTemplateController.createTemplate.bind(dietTemplateController));
router.get("/", verifyToken, dietTemplateController.getTemplates.bind(dietTemplateController));
router.get("/:id", verifyToken, dietTemplateController.getTemplateById.bind(dietTemplateController));
router.put("/:id", verifyToken, dietTemplateController.updateTemplate.bind(dietTemplateController));
router.delete("/:id", verifyToken, dietTemplateController.deleteTemplate.bind(dietTemplateController));

// Şablon öğün işlemleri
router.post("/:templateId/meals", verifyToken, dietTemplateController.addMealToTemplate.bind(dietTemplateController));
router.put("/meals/:mealId", verifyToken, dietTemplateController.updateTemplateMeal.bind(dietTemplateController));
router.delete("/meals/:mealId", verifyToken, dietTemplateController.deleteTemplateMeal.bind(dietTemplateController));

// Şablonu danışanlara atama
router.post("/:templateId/assign", verifyToken, dietTemplateController.assignTemplateToClients.bind(dietTemplateController));

export default router;

