import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

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

            await client.query("COMMIT");
            return result.rows[0];
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
            await client.query("COMMIT");

            return result.rows[0];
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

            await client.query(
                `DELETE FROM financial_records WHERE id = $1`,
                [recordId]
            );

            await client.query("COMMIT");
            return { message: "Finansal kayıt başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

