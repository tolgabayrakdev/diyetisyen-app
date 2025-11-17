import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class ProgressLogService {
    
    async createLog(dietitianId, clientId, logData) {
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
                `INSERT INTO progress_logs (
                    client_id, log_date, weight_kg, body_fat_percent, muscle_mass_kg, notes
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    clientId,
                    logData.log_date || new Date(),
                    logData.weight_kg || null,
                    logData.body_fat_percent || null,
                    logData.muscle_mass_kg || null,
                    logData.notes || null
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

    async getLogs(dietitianId, clientId, page = 1, limit = 10) {
        // Danışanın bu diyetisyene ait olduğunu kontrol et
        const clientCheck = await pool.query(
            `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (clientCheck.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        const offset = (page - 1) * limit;
        const result = await pool.query(
            `SELECT * FROM progress_logs 
             WHERE client_id = $1 
             ORDER BY log_date DESC, created_at DESC
             LIMIT $2 OFFSET $3`,
            [clientId, limit, offset]
        );

        // Toplam sayıyı al
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM progress_logs WHERE client_id = $1`,
            [clientId]
        );
        const total = parseInt(countResult.rows[0].count);

        return {
            logs: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getLogById(dietitianId, logId) {
        const result = await pool.query(
            `SELECT pl.* FROM progress_logs pl
             INNER JOIN clients c ON pl.client_id = c.id
             WHERE pl.id = $1 AND c.dietitian_id = $2`,
            [logId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "İlerleme kaydı bulunamadı");
        }

        return result.rows[0];
    }

    async updateLog(dietitianId, logId, logData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Kaydın bu diyetisyene ait olduğunu kontrol et
            const existingLog = await client.query(
                `SELECT pl.id FROM progress_logs pl
                 INNER JOIN clients c ON pl.client_id = c.id
                 WHERE pl.id = $1 AND c.dietitian_id = $2`,
                [logId, dietitianId]
            );

            if (existingLog.rows.length === 0) {
                throw new HttpException(404, "İlerleme kaydı bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = ['log_date', 'weight_kg', 'body_fat_percent', 'muscle_mass_kg', 'notes'];
            allowedFields.forEach(field => {
                if (logData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(logData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateValues.push(logId);

            const query = `
                UPDATE progress_logs 
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

    async deleteLog(dietitianId, logId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Kaydın bu diyetisyene ait olduğunu kontrol et
            const existingLog = await client.query(
                `SELECT pl.id FROM progress_logs pl
                 INNER JOIN clients c ON pl.client_id = c.id
                 WHERE pl.id = $1 AND c.dietitian_id = $2`,
                [logId, dietitianId]
            );

            if (existingLog.rows.length === 0) {
                throw new HttpException(404, "İlerleme kaydı bulunamadı");
            }

            await client.query(
                `DELETE FROM progress_logs WHERE id = $1`,
                [logId]
            );

            await client.query("COMMIT");
            return { message: "İlerleme kaydı başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

