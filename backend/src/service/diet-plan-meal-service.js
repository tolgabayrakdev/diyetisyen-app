import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class DietPlanMealService {
    
    async createMeal(dietitianId, dietPlanId, mealData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Diyet planının bu diyetisyene ait olduğunu kontrol et
            const planCheck = await client.query(
                `SELECT dp.id FROM diet_plans dp
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dp.id = $1 AND c.dietitian_id = $2`,
                [dietPlanId, dietitianId]
            );

            if (planCheck.rows.length === 0) {
                throw new HttpException(404, "Diyet planı bulunamadı");
            }

            const result = await client.query(
                `INSERT INTO diet_plan_meals (
                    diet_plan_id, meal_time, foods, calories, content, day_of_week
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    dietPlanId,
                    mealData.meal_time || null,
                    mealData.foods ? JSON.stringify(mealData.foods) : null,
                    mealData.calories || null,
                    mealData.content || null,
                    mealData.day_of_week !== undefined ? mealData.day_of_week : null
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

    async getMeals(dietitianId, dietPlanId) {
        // Diyet planının bu diyetisyene ait olduğunu kontrol et
        const planCheck = await pool.query(
            `SELECT dp.id FROM diet_plans dp
             INNER JOIN clients c ON dp.client_id = c.id
             WHERE dp.id = $1 AND c.dietitian_id = $2`,
            [dietPlanId, dietitianId]
        );

        if (planCheck.rows.length === 0) {
            throw new HttpException(404, "Diyet planı bulunamadı");
        }

        const result = await pool.query(
            `SELECT * FROM diet_plan_meals 
             WHERE diet_plan_id = $1 
             ORDER BY meal_time, created_at`,
            [dietPlanId]
        );

        // JSONB alanlarını parse et
        return result.rows.map(row => ({
            ...row,
            foods: row.foods ? (typeof row.foods === 'string' ? JSON.parse(row.foods) : row.foods) : null
        }));
    }

    async getMealById(dietitianId, mealId) {
        const result = await pool.query(
            `SELECT dpm.* FROM diet_plan_meals dpm
             INNER JOIN diet_plans dp ON dpm.diet_plan_id = dp.id
             INNER JOIN clients c ON dp.client_id = c.id
             WHERE dpm.id = $1 AND c.dietitian_id = $2`,
            [mealId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Öğün bulunamadı");
        }

        const row = result.rows[0];
        return {
            ...row,
            foods: row.foods ? (typeof row.foods === 'string' ? JSON.parse(row.foods) : row.foods) : null
        };
    }

    async updateMeal(dietitianId, mealId, mealData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Öğünün bu diyetisyene ait olduğunu kontrol et
            const existingMeal = await client.query(
                `SELECT dpm.id FROM diet_plan_meals dpm
                 INNER JOIN diet_plans dp ON dpm.diet_plan_id = dp.id
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dpm.id = $1 AND c.dietitian_id = $2`,
                [mealId, dietitianId]
            );

            if (existingMeal.rows.length === 0) {
                throw new HttpException(404, "Öğün bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            if (mealData.meal_time !== undefined) {
                updateFields.push(`meal_time = $${paramIndex++}`);
                updateValues.push(mealData.meal_time);
            }

            if (mealData.foods !== undefined) {
                updateFields.push(`foods = $${paramIndex++}`);
                updateValues.push(JSON.stringify(mealData.foods));
            }

            if (mealData.calories !== undefined) {
                updateFields.push(`calories = $${paramIndex++}`);
                updateValues.push(mealData.calories);
            }

            if (mealData.content !== undefined) {
                updateFields.push(`content = $${paramIndex++}`);
                updateValues.push(mealData.content);
            }

            if (mealData.day_of_week !== undefined) {
                updateFields.push(`day_of_week = $${paramIndex++}`);
                updateValues.push(mealData.day_of_week);
            }

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date());

            updateValues.push(mealId);

            const query = `
                UPDATE diet_plan_meals 
                SET ${updateFields.join(", ")}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await client.query(query, updateValues);
            await client.query("COMMIT");

            const row = result.rows[0];
            return {
                ...row,
                foods: row.foods ? (typeof row.foods === 'string' ? JSON.parse(row.foods) : row.foods) : null
            };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    async deleteMeal(dietitianId, mealId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Öğünün bu diyetisyene ait olduğunu kontrol et
            const existingMeal = await client.query(
                `SELECT dpm.id FROM diet_plan_meals dpm
                 INNER JOIN diet_plans dp ON dpm.diet_plan_id = dp.id
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE dpm.id = $1 AND c.dietitian_id = $2`,
                [mealId, dietitianId]
            );

            if (existingMeal.rows.length === 0) {
                throw new HttpException(404, "Öğün bulunamadı");
            }

            await client.query(
                `DELETE FROM diet_plan_meals WHERE id = $1`,
                [mealId]
            );

            await client.query("COMMIT");
            return { message: "Öğün başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

