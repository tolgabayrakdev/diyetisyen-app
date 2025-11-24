import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import FoodCategoryController from "../controller/food-category-controller.js";
import FoodController from "../controller/food-controller.js";

const router = express.Router();
const foodCategoryController = new FoodCategoryController();
const foodController = new FoodController();

// Kategori route'ları
router.post("/foods/categories", verifyToken, foodCategoryController.createCategory.bind(foodCategoryController));
router.get("/foods/categories", verifyToken, foodCategoryController.getCategories.bind(foodCategoryController));
router.get("/foods/categories/:id", verifyToken, foodCategoryController.getCategoryById.bind(foodCategoryController));
router.put("/foods/categories/:id", verifyToken, foodCategoryController.updateCategory.bind(foodCategoryController));
router.delete("/foods/categories/:id", verifyToken, foodCategoryController.deleteCategory.bind(foodCategoryController));

// Besin route'ları
router.post("/foods", verifyToken, foodController.createFood.bind(foodController));
router.get("/foods", verifyToken, foodController.getFoods.bind(foodController));
router.get("/foods/:id", verifyToken, foodController.getFoodById.bind(foodController));
router.put("/foods/:id", verifyToken, foodController.updateFood.bind(foodController));
router.delete("/foods/:id", verifyToken, foodController.deleteFood.bind(foodController));

export default router;

