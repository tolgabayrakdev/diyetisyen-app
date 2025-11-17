import ProgressLogService from "../service/progress-log-service.js";

export default class ProgressLogController {
    constructor() {
        this.progressLogService = new ProgressLogService();
    }

    async createLog(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.progressLogService.createLog(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "İlerleme kaydı başarıyla oluşturuldu",
                log: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await this.progressLogService.getLogs(dietitianId, clientId, page, limit);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getLogById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const logId = req.params.id;
            const result = await this.progressLogService.getLogById(dietitianId, logId);
            res.status(200).json({
                success: true,
                log: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateLog(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const logId = req.params.id;
            const result = await this.progressLogService.updateLog(dietitianId, logId, req.body);
            res.status(200).json({
                success: true,
                message: "İlerleme kaydı güncellendi",
                log: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteLog(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const logId = req.params.id;
            const result = await this.progressLogService.deleteLog(dietitianId, logId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

