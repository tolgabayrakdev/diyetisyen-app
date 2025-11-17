import ActivityLogService from "../service/activity-log-service.js";

export default class ActivityLogController {
    constructor() {
        this.activityLogService = new ActivityLogService();
    }

    async getLogs(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.query.clientId || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await this.activityLogService.getLogs(dietitianId, clientId, page, limit);
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
            const result = await this.activityLogService.getLogById(dietitianId, logId);
            res.status(200).json({
                success: true,
                log: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getLogsByEntity(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const entityType = req.params.entityType;
            const entityId = req.query.entityId || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await this.activityLogService.getLogsByEntity(dietitianId, entityType, entityId, page, limit);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}

