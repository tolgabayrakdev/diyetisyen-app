import FoodService from "../service/food-service.js";

export default class FoodController {
    constructor() {
        this.foodService = new FoodService();
    }

    async createFood(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const foodData = req.body;

            const food = await this.foodService.createFood(dietitianId, foodData);

            res.status(201).json({
                success: true,
                food
            });
        } catch (error) {
            next(error);
        }
    }

    async getFoods(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { category_id, search, page, limit, is_active } = req.query;

            const filters = {
                category_id: category_id || null,
                search: search || null,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20,
                is_active: is_active !== undefined ? is_active === 'true' : true
            };

            const result = await this.foodService.getFoods(dietitianId, filters);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getFoodById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;

            const food = await this.foodService.getFoodById(dietitianId, id);

            res.status(200).json({
                success: true,
                food
            });
        } catch (error) {
            next(error);
        }
    }

    async updateFood(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;
            const foodData = req.body;

            const food = await this.foodService.updateFood(dietitianId, id, foodData);

            res.status(200).json({
                success: true,
                food
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteFood(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;

            await this.foodService.deleteFood(dietitianId, id);

            res.status(200).json({
                success: true,
                message: "Besin başarıyla silindi"
            });
        } catch (error) {
            next(error);
        }
    }
}

