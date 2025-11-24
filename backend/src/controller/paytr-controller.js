import PayTRService from "../service/paytr-service.js";
import HttpException from "../exceptions/http-exception.js";
import pool from "../config/database.js";

export default class PayTRController {
    constructor() {
        this.paytrService = new PayTRService();
    }

    /**
     * PayTR token oluştur
     */
    async getToken(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const { planId } = req.body;
            // IP adresini al (proxy arkasındaysa x-forwarded-for kullan)
            const userIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                          req.connection?.remoteAddress || 
                          req.socket?.remoteAddress ||
                          '127.0.0.1';

            if (!planId) {
                throw new HttpException(400, "Plan ID gereklidir");
            }

            const result = await this.paytrService.getToken(dietitianId, planId, userIp);

            res.json({
                success: true,
                token: result.token,
                merchantOid: result.merchantOid
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PayTR callback işleme
     */
    async handleCallback(req, res, next) {
        try {
            const callbackData = req.body;

            // PayTR callback'i işle
            await this.paytrService.handleCallback(callbackData);
            
            // PayTR'ye OK döndür (önemli!)
            res.status(200).send('OK');
        } catch (error) {
            // Hata olsa bile PayTR'ye OK döndür (tekrar denemesi için)
            res.status(200).send('OK');
        }
    }

    /**
     * Ödeme başarılı olduğunda subscription'ı manuel oluştur
     * (PayTR callback gelmediğinde kullanılır)
     */
    async verifyAndCreateSubscription(req, res, next) {
        try {
            const userId = req.user.id;
            const { merchantOid } = req.body;

            if (!merchantOid) {
                throw new HttpException(400, "Merchant OID gereklidir");
            }

            // Transaction'ı bul
            const transactionResult = await pool.query(
                "SELECT * FROM payment_transactions WHERE merchant_oid = $1 AND user_id = $2",
                [merchantOid, userId]
            );

            if (transactionResult.rows.length === 0) {
                throw new HttpException(404, "Ödeme kaydı bulunamadı");
            }

            const transaction = transactionResult.rows[0];

            // Eğer transaction completed veya pending ise ve subscription yoksa oluştur
            // (Pending olabilir çünkü callback gelmemiş olabilir)
            if (transaction.status === 'completed' || transaction.status === 'pending') {
                // Eğer pending ise completed'e çevir
                if (transaction.status === 'pending') {
                    await pool.query(
                        `UPDATE payment_transactions 
                         SET status = 'completed', 
                             payment_date = NOW(),
                             updated_at = NOW()
                         WHERE merchant_oid = $1`,
                        [merchantOid]
                    );
                }
                // Subscription var mı kontrol et
                const existingSubscription = await pool.query(
                    `SELECT s.* FROM subscriptions s
                     WHERE s.user_id = $1 
                     AND s.plan_id = $2 
                     AND s.status = 'active'
                     AND s.payment_method = 'paytr'
                     ORDER BY s.created_at DESC LIMIT 1`,
                    [userId, transaction.plan_id]
                );

                if (existingSubscription.rows.length > 0) {
                    return res.json({
                        success: true,
                        message: "Subscription zaten mevcut",
                        subscription: existingSubscription.rows[0]
                    });
                }

                // Subscription oluştur
                const subscription = await this.paytrService.createSubscriptionForTransaction(
                    userId,
                    transaction.plan_id
                );

                return res.json({
                    success: true,
                    message: "Subscription başarıyla oluşturuldu",
                    subscription: subscription
                });
            } else {
                return res.json({
                    success: false,
                    message: `Ödeme durumu: ${transaction.status}. Subscription oluşturulamadı.`
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

