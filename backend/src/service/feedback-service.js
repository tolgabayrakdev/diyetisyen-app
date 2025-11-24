import pool from "../config/database.js";
import { sendEmail } from "../util/send-email.js";
import HttpException from "../exceptions/http-exception.js";
import logger from "../config/logger.js";

export default class FeedbackService {
    async sendFeedback(dietitianId, feedbackData) {
        const { subject, message, type } = feedbackData;

        try {
            // Kullanıcı bilgilerini al
            const userResult = await pool.query(
                "SELECT first_name, last_name, email FROM users WHERE id = $1",
                [dietitianId]
            );

            if (userResult.rows.length === 0) {
                throw new HttpException(404, "Kullanıcı bulunamadı");
            }

            const user = userResult.rows[0];
            const userName = `${user.first_name} ${user.last_name}`;
            const userEmail = user.email;

            // HTML escape fonksiyonu
            const escapeHtml = (text) => {
                if (!text) return "";
                return String(text)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            };

            // Email içeriğini oluştur
            const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #6366f1; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                        .info { background-color: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #6366f1; }
                        .message { background-color: #fff; padding: 15px; margin: 15px 0; border: 1px solid #e5e7eb; border-radius: 5px; white-space: pre-wrap; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Yeni Öneri/İstek Bildirimi</h2>
                        </div>
                        <div class="content">
                            <div class="info">
                                <strong>Gönderen:</strong> ${escapeHtml(userName)}<br>
                                <strong>E-posta:</strong> ${escapeHtml(userEmail)}<br>
                                <strong>Tip:</strong> ${type === "feature" ? "Özellik İsteği" : type === "bug" ? "Hata Bildirimi" : "Genel"}
                            </div>
                            <div class="message">
                                <strong>Konu:</strong> ${escapeHtml(subject)}<br><br>
                                <strong>Mesaj:</strong><br>
                                ${escapeHtml(message).replace(/\n/g, "<br>")}
                            </div>
                        </div>
                        <div class="footer">
                            <p>Bu e-posta DiyetKa platformundan gönderilmiştir.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            // Email gönder
            await sendEmail(
                "diyetka@gmail.com",
                `[DiyetKa] ${subject}`,
                emailHtml,
                {
                    replyTo: userEmail
                }
            );

            logger.info("Feedback email sent", {
                dietitianId,
                subject,
                type
            });

            return {
                success: true,
                message: "Öneri/istek başarıyla gönderildi"
            };
        } catch (error) {
            logger.error("Failed to send feedback email", {
                dietitianId,
                error: error.message
            });
            throw new HttpException(500, `Öneri/istek gönderilemedi: ${error.message}`);
        }
    }
}

