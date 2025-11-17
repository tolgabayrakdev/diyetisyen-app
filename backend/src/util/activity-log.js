import pool from "../config/database.js";

/**
 * Aktivite logu oluşturur
 * @param {string} userId - İşlemi yapan kullanıcı ID
 * @param {string|null} clientId - İlgili danışan ID (opsiyonel)
 * @param {string} entityType - Entity tipi (örn: 'diet_plan', 'note', 'financial_record', 'client', etc.)
 * @param {string} actionType - Aksiyon tipi (örn: 'create', 'update', 'delete')
 * @param {string} description - Açıklama
 */
export async function createActivityLog(userId, clientId, entityType, actionType, description) {
    try {
        await pool.query(
            `INSERT INTO activity_logs (
                user_id, client_id, entity_type, action_type, description
            ) VALUES ($1, $2, $3, $4, $5)`,
            [userId, clientId || null, entityType, actionType, description]
        );
    } catch (error) {
        // Activity log hataları uygulamayı durdurmamalı
        console.error("Activity log oluşturulurken hata:", error);
    }
}

