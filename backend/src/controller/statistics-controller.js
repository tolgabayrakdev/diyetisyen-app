import StatisticsService from "../service/statistics-service.js";

export default class StatisticsController {
    constructor() {
        this.statisticsService = new StatisticsService();
    }

    async getStatistics(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const statistics = await this.statisticsService.getStatistics(dietitianId);
            res.status(200).json({
                success: true,
                ...statistics
            });
        } catch (error) {
            next(error);
        }
    }
}

