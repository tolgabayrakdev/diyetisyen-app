import AIService from "../service/ai-service.js";
import ProgressLogService from "../service/progress-log-service.js";
import ClientService from "../service/client-service.js";

export default class AIController {
    constructor() {
        this.aiService = new AIService();
        this.progressLogService = new ProgressLogService();
        this.clientService = new ClientService();
    }

    /**
     * Kilo değişimini özetler
     */
    async summarizeWeightChange(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;

            // Danışan bilgilerini al
            const client = await this.clientService.getClientById(dietitianId, clientId);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: "Danışan bulunamadı"
                });
            }

            // Tüm ilerleme kayıtlarını al (pagination olmadan)
            const result = await this.progressLogService.getLogs(dietitianId, clientId, 1, 1000);
            const progressLogs = result.logs;

            if (progressLogs.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Kilo değişimini özetlemek için en az 2 kayıt gereklidir."
                });
            }

            // AI ile özet oluştur
            const summary = await this.aiService.summarizeWeightChange(progressLogs, client);

            res.status(200).json({
                success: true,
                summary: summary
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Haftalık ilerlemeyi yorumlar
     */
    async commentWeeklyProgress(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;

            // Danışan bilgilerini al
            const client = await this.clientService.getClientById(dietitianId, clientId);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: "Danışan bulunamadı"
                });
            }

            // Tüm ilerleme kayıtlarını al (pagination olmadan)
            const result = await this.progressLogService.getLogs(dietitianId, clientId, 1, 1000);
            const progressLogs = result.logs;

            if (progressLogs.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "İlerleme kaydı bulunamadı."
                });
            }

            // AI ile yorum oluştur
            const comment = await this.aiService.commentWeeklyProgress(progressLogs, client);

            res.status(200).json({
                success: true,
                comment: comment
            });
        } catch (error) {
            next(error);
        }
    }
}

