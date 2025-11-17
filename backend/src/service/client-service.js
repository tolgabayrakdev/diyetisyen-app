import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class ClientService {
    
    async createClient(dietitianId, clientData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Diyetisyen kontrolü
            const dietitianResult = await client.query(
                "SELECT id FROM users WHERE id = $1",
                [dietitianId]
            );

            if (dietitianResult.rows.length === 0) {
                throw new HttpException(404, "Diyetisyen bulunamadı");
            }

            const result = await client.query(
                `INSERT INTO clients (
                    dietitian_id, first_name, last_name, email, phone, 
                    birth_date, gender, height_cm, weight_kg, 
                    chronic_conditions, allergies, medications
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *`,
                [
                    dietitianId,
                    clientData.first_name,
                    clientData.last_name,
                    clientData.email || null,
                    clientData.phone || null,
                    clientData.birth_date || null,
                    clientData.gender || null,
                    clientData.height_cm || null,
                    clientData.weight_kg || null,
                    clientData.chronic_conditions || null,
                    clientData.allergies || null,
                    clientData.medications || null
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

    async getClients(dietitianId, page = 1, limit = 10, search = '') {
        const offset = (page - 1) * limit;
        let query = `
            SELECT * FROM clients 
            WHERE dietitian_id = $1
        `;
        const params = [dietitianId];
        let paramIndex = 2;

        if (search) {
            query += ` AND (
                first_name ILIKE $${paramIndex} OR 
                last_name ILIKE $${paramIndex} OR 
                email ILIKE $${paramIndex} OR 
                phone ILIKE $${paramIndex}
            )`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        
        // Toplam sayıyı al
        let countQuery = `SELECT COUNT(*) FROM clients WHERE dietitian_id = $1`;
        const countParams = [dietitianId];
        if (search) {
            countQuery += ` AND (
                first_name ILIKE $2 OR 
                last_name ILIKE $2 OR 
                email ILIKE $2 OR 
                phone ILIKE $2
            )`;
            countParams.push(`%${search}%`);
        }
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        return {
            clients: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getClientById(dietitianId, clientId) {
        const result = await pool.query(
            `SELECT * FROM clients 
             WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        return result.rows[0];
    }

    async updateClient(dietitianId, clientId, clientData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Danışanın bu diyetisyene ait olduğunu kontrol et
            const existingClient = await client.query(
                `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
                [clientId, dietitianId]
            );

            if (existingClient.rows.length === 0) {
                throw new HttpException(404, "Danışan bulunamadı");
            }

            // Güncellenecek alanları belirle
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = [
                'first_name', 'last_name', 'email', 'phone', 
                'birth_date', 'gender', 'height_cm', 'weight_kg',
                'chronic_conditions', 'allergies', 'medications'
            ];

            allowedFields.forEach(field => {
                if (clientData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(clientData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date());

            updateValues.push(clientId, dietitianId);

            const query = `
                UPDATE clients 
                SET ${updateFields.join(", ")}
                WHERE id = $${paramIndex} AND dietitian_id = $${paramIndex + 1}
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

    async deleteClient(dietitianId, clientId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Danışanın bu diyetisyene ait olduğunu kontrol et
            const existingClient = await client.query(
                `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
                [clientId, dietitianId]
            );

            if (existingClient.rows.length === 0) {
                throw new HttpException(404, "Danışan bulunamadı");
            }

            await client.query(
                `DELETE FROM clients WHERE id = $1 AND dietitian_id = $2`,
                [clientId, dietitianId]
            );

            await client.query("COMMIT");
            return { message: "Danışan başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

