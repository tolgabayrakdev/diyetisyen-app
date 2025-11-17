import DietPlanMealService from "../service/diet-plan-meal-service.js";

export default class DietPlanMealController {
    constructor() {
        this.dietPlanMealService = new DietPlanMealService();
    }

    async createMeal(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const dietPlanId = req.params.dietPlanId;
            const result = await this.dietPlanMealService.createMeal(dietitianId, dietPlanId, req.body);
            res.status(201).json({
                success: true,
                message: "Öğün başarıyla eklendi",
                meal: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getMeals(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const dietPlanId = req.params.dietPlanId;
            const result = await this.dietPlanMealService.getMeals(dietitianId, dietPlanId);
            res.status(200).json({
                success: true,
                meals: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getMealById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const mealId = req.params.id;
            const result = await this.dietPlanMealService.getMealById(dietitianId, mealId);
            res.status(200).json({
                success: true,
                meal: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMeal(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const mealId = req.params.id;
            const result = await this.dietPlanMealService.updateMeal(dietitianId, mealId, req.body);
            res.status(200).json({
                success: true,
                message: "Öğün güncellendi",
                meal: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMeal(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const mealId = req.params.id;
            const result = await this.dietPlanMealService.deleteMeal(dietitianId, mealId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

