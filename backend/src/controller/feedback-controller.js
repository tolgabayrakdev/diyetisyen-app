import FeedbackService from "../service/feedback-service.js";
import HttpException from "../exceptions/http-exception.js";

export default class FeedbackController {
    constructor() {
        this.feedbackService = new FeedbackService();
    }

    async sendFeedback(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { subject, message, type } = req.body;

            if (!subject || !message) {
                throw new HttpException(400, "Konu ve mesaj gereklidir");
            }

            const result = await this.feedbackService.sendFeedback(dietitianId, {
                subject,
                message,
                type: type || "general"
            });

            res.json({
                success: true,
                message: "Öneri/istek başarıyla gönderildi",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

