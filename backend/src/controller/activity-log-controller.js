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

    async exportAllLogs(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const logs = await this.activityLogService.getAllLogs(dietitianId);
            
            // CSV formatına dönüştür
            const headers = ['ID', 'Danışan ID', 'Danışan Adı', 'Danışan Soyadı', 'Varlık Tipi', 'Aksiyon Tipi', 'Açıklama', 'Oluşturulma Tarihi'];
            const rows = logs.map(log => [
                log.id,
                log.client_id || '',
                log.client_first_name || '',
                log.client_last_name || '',
                log.entity_type || '',
                log.action_type || '',
                (log.description || '').replace(/"/g, '""'), // CSV için tırnak işaretlerini escape et
                new Date(log.created_at).toLocaleString('tr-TR')
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // BOM ekle (Türkçe karakterler için)
            const BOM = '\uFEFF';
            const csvWithBOM = BOM + csvContent;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="aktivite-kayitlari-${new Date().toISOString().split('T')[0]}.csv"`);
            res.status(200).send(csvWithBOM);
        } catch (error) {
            next(error);
        }
    }
}

