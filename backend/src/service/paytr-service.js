import crypto from "crypto";
import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import SubscriptionService from "./subscription-service.js";

export default class PayTRService {
    constructor() {
        this.merchantId = process.env.PAYTR_MERCHANT_ID;
        this.merchantKey = process.env.PAYTR_MERCHANT_KEY;
        this.merchantSalt = process.env.PAYTR_MERCHANT_SALT;
        this.baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        this.subscriptionService = new SubscriptionService();
    }

    /**
     * PayTR token oluştur
     */
    async getToken(dietitianId, planId, userIp) {
        try {
            // Kullanıcı bilgilerini al
            const userResult = await pool.query(
                "SELECT id, first_name, last_name, email, phone FROM users WHERE id = $1",
                [dietitianId]
            );

            if (userResult.rows.length === 0) {
                throw new HttpException(404, "Kullanıcı bulunamadı");
            }

            const user = userResult.rows[0];
            
            // PayTR için user_address zorunlu, eğer yoksa varsayılan değer kullan
            const userAddress = "Türkiye"; // PayTR için minimum geçerli adres

            // Plan bilgilerini al
            const planResult = await pool.query(
                "SELECT * FROM plans WHERE id = $1",
                [planId]
            );

            if (planResult.rows.length === 0) {
                throw new HttpException(404, "Plan bulunamadı");
            }

            const plan = planResult.rows[0];

            // Price'ı number'a çevir
            const planPrice = Number(plan.price);
            if (isNaN(planPrice)) {
                throw new HttpException(400, "Geçersiz plan fiyatı");
            }

            // Sipariş numarası oluştur (benzersiz olmalı, alfanumerik, özel karakter yok)
            // UUID'deki tireleri kaldır ve alfanumerik yap
            const cleanDietitianId = dietitianId.replace(/-/g, '');
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substr(2, 9);
            const merchantOid = `SUB${cleanDietitianId}${timestamp}${randomStr}`;

            // Ödeme tutarı (kuruş cinsinden)
            const paymentAmount = Math.round(planPrice * 100);

            // Sepet içeriği (Base64 encoded JSON)
            const basket = JSON.stringify([
                [`${plan.name} ${plan.duration === 'monthly' ? 'Aylık' : 'Yıllık'} Plan`, planPrice.toFixed(2), 1]
            ]);
            const userBasket = Buffer.from(basket).toString('base64');

            // Test mode değeri
            const testMode = process.env.PAYTR_TEST_MODE || '0';
            const noInstallment = '0';
            const maxInstallment = '0';
            const currency = 'TL';

            // Hash oluştur (PayTR dokümantasyonuna göre sıralama)
            // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
            const hashStr = `${this.merchantId}${userIp}${merchantOid}${user.email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
            const paytrToken = hashStr + this.merchantSalt;
            const token = crypto.createHmac('sha256', this.merchantKey).update(paytrToken).digest('base64');

            // PayTR'ye token isteği gönder
            const formData = new URLSearchParams();
            formData.append('merchant_id', this.merchantId);
            formData.append('merchant_key', this.merchantKey);
            formData.append('merchant_salt', this.merchantSalt);
            formData.append('email', user.email);
            formData.append('payment_amount', paymentAmount.toString());
            formData.append('merchant_oid', merchantOid);
            formData.append('user_name', `${user.first_name} ${user.last_name}`);
            formData.append('user_address', userAddress);
            formData.append('user_phone', user.phone || '');
            formData.append('merchant_ok_url', `${this.baseUrl}/payment/success?merchant_oid=${merchantOid}`);
            formData.append('merchant_fail_url', `${this.baseUrl}/payment/fail?merchant_oid=${merchantOid}`);
            formData.append('user_basket', userBasket);
            formData.append('user_ip', userIp);
            formData.append('timeout_limit', '30');
            formData.append('debug_on', process.env.NODE_ENV === 'development' ? '1' : '0');
            formData.append('test_mode', testMode);
            formData.append('lang', 'tr');
            formData.append('no_installment', noInstallment);
            formData.append('max_installment', maxInstallment);
            formData.append('currency', currency);
            formData.append('paytr_token', token);
            formData.append('paytr_token', token);

            const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Ödeme kaydını veritabanına kaydet (pending durumunda)
                await pool.query(
                    `INSERT INTO payment_transactions (
                        user_id, plan_id, merchant_oid, amount, currency, status, payment_method
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [dietitianId, planId, merchantOid, planPrice, 'TL', 'pending', 'paytr']
                );

                return {
                    token: data.token,
                    merchantOid: merchantOid
                };
            } else {
                logger.error('PayTR token error:', data.reason);
                throw new HttpException(400, `PayTR token hatası: ${data.reason || 'Bilinmeyen hata'}`);
            }
        } catch (error) {
            logger.error('PayTR token service error:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `PayTR token oluşturulamadı: ${error.message}`);
        }
    }

    /**
     * PayTR callback işleme
     */
    async handleCallback(callbackData) {
        try {
            const { merchant_oid, status, total_amount, hash } = callbackData;

            // Ödeme kaydını bul
            const transactionResult = await pool.query(
                "SELECT * FROM payment_transactions WHERE merchant_oid = $1",
                [merchant_oid]
            );

            if (transactionResult.rows.length === 0) {
                throw new HttpException(404, "Ödeme kaydı bulunamadı");
            }

            const transaction = transactionResult.rows[0];

            // Hash doğrulama
            const paytrToken = merchant_oid + this.merchantSalt + status + total_amount;
            const calculatedHash = crypto.createHmac('sha256', this.merchantKey).update(paytrToken).digest('base64');

            if (calculatedHash !== hash) {
                throw new HttpException(400, "Hash doğrulama hatası");
            }

            // Başarılı ödeme ise subscription oluştur
            if (status === 'success') {
                
                // Sadece pending durumundaki transaction'lar için subscription oluştur
                if (transaction.status === 'pending') {
                    try {
                        // Bu transaction için zaten subscription oluşturulmuş mu kontrol et
                        // Aynı plan_id ve user_id ile aktif subscription var mı bakalım
                        // Ve bu subscription'ın oluşturulma zamanı transaction'dan sonra mı?
                        const existingSubscription = await pool.query(
                            `SELECT s.* FROM subscriptions s
                             WHERE s.user_id = $1 
                             AND s.plan_id = $2 
                             AND s.status = 'active'
                             AND s.payment_method = 'paytr'
                             AND s.created_at >= (
                                 SELECT created_at FROM payment_transactions 
                                 WHERE merchant_oid = $3
                             )
                             ORDER BY s.created_at DESC LIMIT 1`,
                            [transaction.user_id, transaction.plan_id, merchant_oid]
                        );

                        if (existingSubscription.rows.length > 0) {
                            // Subscription zaten mevcut
                        } else {
                            // SubscriptionService kullanarak subscription oluştur (trial gibi)
                            try {
                                await this.subscriptionService.createSubscription(
                                    transaction.user_id,
                                    transaction.plan_id,
                                    'paytr'
                                );
                            } catch (subscriptionError) {
                                // Hata fırlat ki dış catch bloğu yakalasın
                                throw subscriptionError;
                            }
                        }
                    } catch (error) {
                        // Subscription oluşturma hatası olsa bile transaction'ı güncelle
                        // PayTR'ye OK döndürmek için hata fırlatmıyoruz
                    }
                }
            }

            // Ödeme durumunu güncelle
            await pool.query(
                `UPDATE payment_transactions 
                 SET status = $1, 
                     payment_date = NOW(),
                     updated_at = NOW()
                 WHERE merchant_oid = $2`,
                [status === 'success' ? 'completed' : 'failed', merchant_oid]
            );

            return {
                success: true,
                status: status === 'success' ? 'completed' : 'failed'
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `PayTR callback işlenemedi: ${error.message}`);
        }
    }

    /**
     * Transaction için subscription oluştur (manuel doğrulama için)
     */
    async createSubscriptionForTransaction(userId, planId) {
        return await this.subscriptionService.createSubscription(userId, planId, 'paytr');
    }
}

