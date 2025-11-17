import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class DietPlanService {
    
    async createDietPlan(dietitianId, clientId, planData) {
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
                `INSERT INTO diet_plans (
                    client_id, title, description, start_date, end_date
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    clientId,
                    planData.title,
                    planData.description || null,
                    planData.start_date || null,
                    planData.end_date || null
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

    async getDietPlans(dietitianId, clientId) {
        // Danışanın bu diyetisyene ait olduğunu kontrol et
        const clientCheck = await pool.query(
            `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (clientCheck.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        const result = await pool.query(
            `SELECT * FROM diet_plans 
             WHERE client_id = $1 
             ORDER BY created_at DESC`,
            [clientId]
        );

        return result.rows;
    }

    async getDietPlanById(dietitianId, planId) {
        const result = await pool.query(
            `SELECT dp.* FROM diet_plans dp
             INNER JOIN clients c ON dp.client_id = c.id
             WHERE dp.id = $1 AND c.dietitian_id = $2`,
            [planId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Diyet planı bulunamadı");
        }

        return result.rows[0];
    }

    async updateDietPlan(dietitianId, planId, planData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Planın bu diyetisyene ait olduğunu kontrol et
            const existingPlan = await client.query(
                `SELECT dp.id FROM diet_plans dp
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dp.id = $1 AND c.dietitian_id = $2`,
                [planId, dietitianId]
            );

            if (existingPlan.rows.length === 0) {
                throw new HttpException(404, "Diyet planı bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = ['title', 'description', 'start_date', 'end_date'];
            allowedFields.forEach(field => {
                if (planData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(planData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date());

            updateValues.push(planId);

            const query = `
                UPDATE diet_plans 
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

    async deleteDietPlan(dietitianId, planId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Planın bu diyetisyene ait olduğunu kontrol et
            const existingPlan = await client.query(
                `SELECT dp.id FROM diet_plans dp
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dp.id = $1 AND c.dietitian_id = $2`,
                [planId, dietitianId]
            );

            if (existingPlan.rows.length === 0) {
                throw new HttpException(404, "Diyet planı bulunamadı");
            }

            await client.query(
                `DELETE FROM diet_plans WHERE id = $1`,
                [planId]
            );

            await client.query("COMMIT");
            return { message: "Diyet planı başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

