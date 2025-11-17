import DietPlanService from "../service/diet-plan-service.js";

export default class DietPlanController {
    constructor() {
        this.dietPlanService = new DietPlanService();
    }

    async createDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.dietPlanService.createDietPlan(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "Diyet planı başarıyla oluşturuldu",
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDietPlans(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.dietPlanService.getDietPlans(dietitianId, clientId);
            res.status(200).json({
                success: true,
                dietPlans: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDietPlanById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const result = await this.dietPlanService.getDietPlanById(dietitianId, planId);
            res.status(200).json({
                success: true,
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const result = await this.dietPlanService.updateDietPlan(dietitianId, planId, req.body);
            res.status(200).json({
                success: true,
                message: "Diyet planı güncellendi",
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const result = await this.dietPlanService.deleteDietPlan(dietitianId, planId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

