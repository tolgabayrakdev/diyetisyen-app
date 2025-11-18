import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";

export default class FinancialRecordService {
    
    async createRecord(dietitianId, clientId, recordData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Danışanın bu diyetisyene ait olduğunu kontrol et
            const clientCheck = await client.query(
                `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
                [clientId, dietitianId]
            );

            if (clientCheck.rows.length === 0) {
                throw new HttpException(404, "Danışan bulunamadı");
            }

            const result = await client.query(
                `INSERT INTO financial_records (
                    client_id, amount, currency, payment_date, status, payment_method, description
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    clientId,
                    recordData.amount,
                    recordData.currency || 'TRY',
                    recordData.payment_date || null,
                    recordData.status || 'pending',
                    recordData.payment_method || null,
                    recordData.description || null
                ]
            );

            // Danışan bilgilerini al
            const clientInfo = await client.query(
                `SELECT first_name, last_name FROM clients WHERE id = $1`,
                [clientId]
            );
            const clientName = clientInfo.rows[0] ? `${clientInfo.rows[0].first_name} ${clientInfo.rows[0].last_name}` : 'Danışan';
            
            await client.query("COMMIT");
            
            // Aktivite logu oluştur (transaction dışında)
            const newRecord = result.rows[0];
            await createActivityLog(
                dietitianId,
                clientId,
                'financial_record',
                'create',
                `${clientName} için ${newRecord.amount} ${newRecord.currency} tutarında finansal kayıt eklendi`
            );
            
            return newRecord;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    async getRecords(dietitianId, clientId, page = 1, limit = 10, status = null) {
        // Danışanın bu diyetisyene ait olduğunu kontrol et
        const clientCheck = await pool.query(
            `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (clientCheck.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        const offset = (page - 1) * limit;
        let query = `
            SELECT * FROM financial_records 
            WHERE client_id = $1
        `;
        const params = [clientId];
        let paramIndex = 2;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        query += ` ORDER BY payment_date DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Toplam sayıyı al
        let countQuery = `SELECT COUNT(*) FROM financial_records WHERE client_id = $1`;
        const countParams = [clientId];
        if (status) {
            countQuery += ` AND status = $2`;
            countParams.push(status);
        }
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        return {
            records: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getRecordById(dietitianId, recordId) {
        const result = await pool.query(
            `SELECT fr.* FROM financial_records fr
             INNER JOIN clients c ON fr.client_id = c.id
             WHERE fr.id = $1 AND c.dietitian_id = $2`,
            [recordId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Finansal kayıt bulunamadı");
        }

        return result.rows[0];
    }

    async updateRecord(dietitianId, recordId, recordData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Kaydın bu diyetisyene ait olduğunu kontrol et
            const existingRecord = await client.query(
                `SELECT fr.id FROM financial_records fr
                 INNER JOIN clients c ON fr.client_id = c.id
                 WHERE fr.id = $1 AND c.dietitian_id = $2`,
                [recordId, dietitianId]
            );

            if (existingRecord.rows.length === 0) {
                throw new HttpException(404, "Finansal kayıt bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = ['amount', 'currency', 'payment_date', 'status', 'payment_method', 'description'];
            allowedFields.forEach(field => {
                if (recordData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(recordData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateValues.push(recordId);

            const query = `
                UPDATE financial_records 
                SET ${updateFields.join(", ")}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await client.query(query, updateValues);
            
            // Danışan bilgilerini al
            const clientInfo = await client.query(
                `SELECT c.first_name, c.last_name FROM clients c
                 INNER JOIN financial_records fr ON c.id = fr.client_id
                 WHERE fr.id = $1`,
                [recordId]
            );
            const clientName = clientInfo.rows[0] ? `${clientInfo.rows[0].first_name} ${clientInfo.rows[0].last_name}` : 'Danışan';
            
            await client.query("COMMIT");
            
            // Aktivite logu oluştur (transaction dışında)
            const updatedRecord = result.rows[0];
            await createActivityLog(
                dietitianId,
                updatedRecord.client_id,
                'financial_record',
                'update',
                `${clientName} için finansal kayıt güncellendi`
            );
            
            return updatedRecord;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    async deleteRecord(dietitianId, recordId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Kaydın bu diyetisyene ait olduğunu kontrol et
            const existingRecord = await client.query(
                `SELECT fr.id FROM financial_records fr
                 INNER JOIN clients c ON fr.client_id = c.id
                 WHERE fr.id = $1 AND c.dietitian_id = $2`,
                [recordId, dietitianId]
            );

            if (existingRecord.rows.length === 0) {
                throw new HttpException(404, "Finansal kayıt bulunamadı");
            }

            // Silinmeden önce kayıt ve danışan bilgilerini al
            const recordInfo = await client.query(
                `SELECT fr.client_id, fr.amount, fr.currency, c.first_name, c.last_name 
                 FROM financial_records fr
                 INNER JOIN clients c ON fr.client_id = c.id
                 WHERE fr.id = $1`,
                [recordId]
            );
            const clientName = recordInfo.rows[0] ? `${recordInfo.rows[0].first_name} ${recordInfo.rows[0].last_name}` : 'Danışan';
            const clientId = recordInfo.rows[0]?.client_id;

            await client.query(
                `DELETE FROM financial_records WHERE id = $1`,
                [recordId]
            );

            await client.query("COMMIT");
            
            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                clientId,
                'financial_record',
                'delete',
                `${clientName} için finansal kayıt silindi`
            );
            
            return { message: "Finansal kayıt başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    /**
     * Diyetisyenin tüm danışanlarının finansal kayıtlarını getir
     */
    async getAllRecords(dietitianId, page = 1, limit = 50, status = null, clientId = null) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT 
                fr.*,
                c.id as client_id,
                c.first_name,
                c.last_name
            FROM financial_records fr
            INNER JOIN clients c ON fr.client_id = c.id
            WHERE c.dietitian_id = $1
        `;
        const params = [dietitianId];
        let paramIndex = 2;

        if (clientId) {
            query += ` AND fr.client_id = $${paramIndex++}`;
            params.push(clientId);
        }

        if (status) {
            query += ` AND fr.status = $${paramIndex++}`;
            params.push(status);
        }

        query += ` ORDER BY fr.payment_date DESC, fr.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Toplam sayıyı al
        let countQuery = `
            SELECT COUNT(*) 
            FROM financial_records fr
            INNER JOIN clients c ON fr.client_id = c.id
            WHERE c.dietitian_id = $1
        `;
        const countParams = [dietitianId];
        let countParamIndex = 2;

        if (clientId) {
            countQuery += ` AND fr.client_id = $${countParamIndex++}`;
            countParams.push(clientId);
        }

        if (status) {
            countQuery += ` AND fr.status = $${countParamIndex++}`;
            countParams.push(status);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        return {
            records: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}

