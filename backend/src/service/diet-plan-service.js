import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";

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
                    client_id, title, description, content, start_date, end_date
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    clientId,
                    planData.title,
                    planData.description || null,
                    planData.content || null,
                    planData.start_date || null,
                    planData.end_date || null
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
            const newPlan = result.rows[0];
            await createActivityLog(
                dietitianId,
                clientId,
                'diet_plan',
                'create',
                `${clientName} için "${newPlan.title}" adlı diyet planı oluşturuldu`
            );
            
            return newPlan;
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

            const allowedFields = ['title', 'description', 'content', 'start_date', 'end_date', 'pdf_url'];
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
            
            // Danışan bilgilerini al
            const clientInfo = await client.query(
                `SELECT c.first_name, c.last_name FROM clients c
                 INNER JOIN diet_plans dp ON c.id = dp.client_id
                 WHERE dp.id = $1`,
                [planId]
            );
            const clientName = clientInfo.rows[0] ? `${clientInfo.rows[0].first_name} ${clientInfo.rows[0].last_name}` : 'Danışan';
            
            await client.query("COMMIT");
            
            // Aktivite logu oluştur (transaction dışında)
            const updatedPlan = result.rows[0];
            await createActivityLog(
                dietitianId,
                updatedPlan.client_id,
                'diet_plan',
                'update',
                `${clientName} için "${updatedPlan.title}" adlı diyet planı güncellendi`
            );
            
            return updatedPlan;
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

            // Silinmeden önce plan ve danışan bilgilerini al
            const planInfo = await client.query(
                `SELECT dp.client_id, dp.title, c.first_name, c.last_name 
                 FROM diet_plans dp
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dp.id = $1`,
                [planId]
            );
            const clientName = planInfo.rows[0] ? `${planInfo.rows[0].first_name} ${planInfo.rows[0].last_name}` : 'Danışan';
            const planTitle = planInfo.rows[0]?.title || 'Diyet Planı';
            const clientId = planInfo.rows[0]?.client_id;

            await client.query(
                `DELETE FROM diet_plans WHERE id = $1`,
                [planId]
            );

            await client.query("COMMIT");
            
            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                clientId,
                'diet_plan',
                'delete',
                `${clientName} için "${planTitle}" adlı diyet planı silindi`
            );
            
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

