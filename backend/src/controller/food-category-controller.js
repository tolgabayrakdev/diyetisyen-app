import FoodCategoryService from "../service/food-category-service.js";

export default class FoodCategoryController {
    constructor() {
        this.foodCategoryService = new FoodCategoryService();
    }

    async createCategory(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const categoryData = req.body;

            const category = await this.foodCategoryService.createCategory(dietitianId, categoryData);

            res.status(201).json({
                success: true,
                category
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const dietitianId = req.user.id;

            const categories = await this.foodCategoryService.getCategories(dietitianId);

            res.status(200).json({
                success: true,
                categories
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;

            const category = await this.foodCategoryService.getCategoryById(dietitianId, id);

            res.status(200).json({
                success: true,
                category
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;
            const categoryData = req.body;

            const category = await this.foodCategoryService.updateCategory(dietitianId, id, categoryData);

            res.status(200).json({
                success: true,
                category
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { id } = req.params;

            await this.foodCategoryService.deleteCategory(dietitianId, id);

            res.status(200).json({
                success: true,
                message: "Kategori başarıyla silindi"
            });
        } catch (error) {
            next(error);
        }
    }
}

