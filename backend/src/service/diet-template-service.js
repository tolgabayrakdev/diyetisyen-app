import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";
import { copyPdfFile } from "../util/file-upload.js";

export default class DietTemplateService {
    
    /**
     * Yeni bir diyet şablonu oluştur
     */
    async createTemplate(dietitianId, templateData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const result = await client.query(
                `INSERT INTO diet_templates (
                    dietitian_id, title, description, category, 
                    total_calories, duration_days, pdf_url, is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [
                    dietitianId,
                    templateData.title,
                    templateData.description || null,
                    templateData.category || null,
                    templateData.total_calories || null,
                    templateData.duration_days || null,
                    templateData.pdf_url || null,
                    templateData.is_active !== undefined ? templateData.is_active : true
                ]
            );

            await client.query("COMMIT");
            
            // Aktivite logu
            const newTemplate = result.rows[0];
            await createActivityLog(
                dietitianId,
                null,
                'diet_template',
                'create',
                `"${newTemplate.title}" adlı diyet şablonu oluşturuldu`
            );
            
            return newTemplate;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    /**
     * Diyetisyenin tüm şablonlarını listele
     */
    async getTemplates(dietitianId, filters = {}) {
        let query = `
            SELECT dt.*, 
                   COUNT(DISTINCT dtm.id) as meal_count
            FROM diet_templates dt
            LEFT JOIN diet_template_meals dtm ON dt.id = dtm.diet_template_id
            WHERE dt.dietitian_id = $1
        `;
        const params = [dietitianId];
        let paramIndex = 2;

        // Filtreler
        if (filters.category) {
            query += ` AND dt.category = $${paramIndex++}`;
            params.push(filters.category);
        }

        if (filters.is_active !== undefined) {
            query += ` AND dt.is_active = $${paramIndex++}`;
            params.push(filters.is_active);
        }

        if (filters.search) {
            query += ` AND (
                dt.title ILIKE $${paramIndex} OR 
                dt.description ILIKE $${paramIndex}
            )`;
            params.push(`%${filters.search}%`);
            paramIndex++;
        }

        query += ` GROUP BY dt.id ORDER BY dt.created_at DESC`;

        const result = await pool.query(query, params);
        return result.rows;
    }

    /**
     * Şablon detayını getir (öğünlerle birlikte)
     */
    async getTemplateById(dietitianId, templateId) {
        // Şablon bilgilerini al
        const templateResult = await pool.query(
            `SELECT * FROM diet_templates 
             WHERE id = $1 AND dietitian_id = $2`,
            [templateId, dietitianId]
        );

        if (templateResult.rows.length === 0) {
            throw new HttpException(404, "Diyet şablonu bulunamadı");
        }

        const template = templateResult.rows[0];

        // Öğünleri al
        const mealsResult = await pool.query(
            `SELECT * FROM diet_template_meals 
             WHERE diet_template_id = $1 
             ORDER BY day_of_week NULLS FIRST, meal_time`,
            [templateId]
        );

        // JSONB alanlarını parse et
        const meals = mealsResult.rows.map(row => ({
            ...row,
            foods: row.foods ? (typeof row.foods === 'string' ? JSON.parse(row.foods) : row.foods) : null
        }));

        return {
            ...template,
            meals
        };
    }

    /**
     * Şablonu güncelle
     */
    async updateTemplate(dietitianId, templateId, templateData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Şablonun bu diyetisyene ait olduğunu kontrol et
            const existingTemplate = await client.query(
                `SELECT id, title FROM diet_templates 
                 WHERE id = $1 AND dietitian_id = $2`,
                [templateId, dietitianId]
            );

            if (existingTemplate.rows.length === 0) {
                throw new HttpException(404, "Diyet şablonu bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = ['title', 'description', 'category', 'total_calories', 'duration_days', 'pdf_url', 'is_active'];
            allowedFields.forEach(field => {
                if (templateData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(templateData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date());
            updateValues.push(templateId);

            const query = `
                UPDATE diet_templates 
                SET ${updateFields.join(", ")}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await client.query(query, updateValues);
            await client.query("COMMIT");
            
            // Aktivite logu
            const updatedTemplate = result.rows[0];
            await createActivityLog(
                dietitianId,
                null,
                'diet_template',
                'update',
                `"${updatedTemplate.title}" adlı diyet şablonu güncellendi`
            );
            
            return updatedTemplate;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    /**
     * Şablonu sil
     */
    async deleteTemplate(dietitianId, templateId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Şablonun bu diyetisyene ait olduğunu kontrol et
            const existingTemplate = await client.query(
                `SELECT id, title FROM diet_templates 
                 WHERE id = $1 AND dietitian_id = $2`,
                [templateId, dietitianId]
            );

            if (existingTemplate.rows.length === 0) {
                throw new HttpException(404, "Diyet şablonu bulunamadı");
            }

            const templateTitle = existingTemplate.rows[0].title;

            // Şablonu sil (cascade ile öğünler de silinir)
            await client.query(
                `DELETE FROM diet_templates WHERE id = $1`,
                [templateId]
            );

            await client.query("COMMIT");
            
            // Aktivite logu
            await createActivityLog(
                dietitianId,
                null,
                'diet_template',
                'delete',
                `"${templateTitle}" adlı diyet şablonu silindi`
            );
            
            return { message: "Diyet şablonu başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    /**
     * Şablona öğün ekle
     */
    async addMealToTemplate(dietitianId, templateId, mealData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Şablonun bu diyetisyene ait olduğunu kontrol et
            const templateCheck = await client.query(
                `SELECT id FROM diet_templates 
                 WHERE id = $1 AND dietitian_id = $2`,
                [templateId, dietitianId]
            );

            if (templateCheck.rows.length === 0) {
                throw new HttpException(404, "Diyet şablonu bulunamadı");
            }

            const result = await client.query(
                `INSERT INTO diet_template_meals (
                    diet_template_id, meal_time, foods, calories, day_of_week, notes
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    templateId,
                    mealData.meal_time,
                    mealData.foods ? JSON.stringify(mealData.foods) : null,
                    mealData.calories || null,
                    mealData.day_of_week !== undefined ? mealData.day_of_week : null,
                    mealData.notes || null
                ]
            );

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

    /**
     * Şablon öğününü güncelle
     */
    async updateTemplateMeal(dietitianId, mealId, mealData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Öğünün bu diyetisyene ait şablona ait olduğunu kontrol et
            const existingMeal = await client.query(
                `SELECT dtm.id FROM diet_template_meals dtm
                 INNER JOIN diet_templates dt ON dtm.diet_template_id = dt.id
                 WHERE dtm.id = $1 AND dt.dietitian_id = $2`,
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

            if (mealData.day_of_week !== undefined) {
                updateFields.push(`day_of_week = $${paramIndex++}`);
                updateValues.push(mealData.day_of_week);
            }

            if (mealData.notes !== undefined) {
                updateFields.push(`notes = $${paramIndex++}`);
                updateValues.push(mealData.notes);
            }

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date());
            updateValues.push(mealId);

            const query = `
                UPDATE diet_template_meals 
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

    /**
     * Şablon öğününü sil
     */
    async deleteTemplateMeal(dietitianId, mealId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Öğünün bu diyetisyene ait şablona ait olduğunu kontrol et
            const existingMeal = await client.query(
                `SELECT dtm.id FROM diet_template_meals dtm
                 INNER JOIN diet_templates dt ON dtm.diet_template_id = dt.id
                 WHERE dtm.id = $1 AND dt.dietitian_id = $2`,
                [mealId, dietitianId]
            );

            if (existingMeal.rows.length === 0) {
                throw new HttpException(404, "Öğün bulunamadı");
            }

            await client.query(
                `DELETE FROM diet_template_meals WHERE id = $1`,
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

    /**
     * Şablonu bir veya birden fazla danışana ata
     * Bu işlem şablonu kopyalayarak diet_plans ve diet_plan_meals oluşturur
     */
    async assignTemplateToClients(dietitianId, templateId, clientIds, assignmentData = {}) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Şablonu ve öğünlerini al (transaction içinde direkt sorgu)
            const templateResult = await client.query(
                `SELECT * FROM diet_templates 
                 WHERE id = $1 AND dietitian_id = $2`,
                [templateId, dietitianId]
            );

            if (templateResult.rows.length === 0) {
                throw new HttpException(404, "Diyet şablonu bulunamadı");
            }

            const template = templateResult.rows[0];

            // Öğünleri al
            const mealsResult = await client.query(
                `SELECT * FROM diet_template_meals 
                 WHERE diet_template_id = $1 
                 ORDER BY day_of_week NULLS FIRST, meal_time`,
                [templateId]
            );

            const meals = mealsResult.rows.map(row => ({
                ...row,
                foods: row.foods ? (typeof row.foods === 'string' ? JSON.parse(row.foods) : row.foods) : row.foods
            }));
            
            if (!meals || meals.length === 0) {
                throw new HttpException(400, "Şablonun öğünleri bulunamadı. Önce şablona öğün ekleyin.");
            }

            // Tüm client'ların bu diyetisyene ait olduğunu kontrol et
            const placeholders = clientIds.map((_, index) => `$${index + 1}`).join(', ');
            const clientsCheck = await client.query(
                `SELECT id, first_name, last_name FROM clients 
                 WHERE id IN (${placeholders}) AND dietitian_id = $${clientIds.length + 1}`,
                [...clientIds, dietitianId]
            );

            if (clientsCheck.rows.length !== clientIds.length) {
                throw new HttpException(400, "Bazı danışanlar bulunamadı veya size ait değil");
            }

            const assignedPlans = [];
            
            // Eğer şablonda PDF varsa, her client için kopyala
            let copiedPdfUrl = null;
            if (template.pdf_url) {
                try {
                    copiedPdfUrl = await copyPdfFile(template.pdf_url);
                } catch (error) {
                    console.error("PDF kopyalanırken hata:", error);
                    // PDF kopyalama hatası kritik değil, devam et
                }
            }

            // Her client için plan oluştur
            for (const clientId of clientIds) {
                // Diet plan oluştur
                const planResult = await client.query(
                    `INSERT INTO diet_plans (
                        client_id, title, description, start_date, end_date
                    ) VALUES ($1, $2, $3, $4, $5)
                    RETURNING *`,
                    [
                        clientId,
                        assignmentData.title || template.title,
                        assignmentData.description || template.description,
                        assignmentData.start_date || null,
                        assignmentData.end_date || null
                    ]
                );

                const newPlan = planResult.rows[0];
                
                // Eğer PDF varsa, her client için ayrı kopya oluştur
                if (template.pdf_url) {
                    try {
                        const clientPdfUrl = await copyPdfFile(template.pdf_url);
                        // PDF URL'ini plan açıklamasına ekleyebiliriz veya ayrı bir tabloda saklayabiliriz
                        // Şimdilik sadece kopyalıyoruz, gerekirse diet_plans tablosuna pdf_url kolonu eklenebilir
                    } catch (error) {
                        console.error(`Client ${clientId} için PDF kopyalanırken hata:`, error);
                    }
                }

                // Şablon öğünlerini kopyala
                for (const meal of meals) {
                    await client.query(
                        `INSERT INTO diet_plan_meals (
                            diet_plan_id, meal_time, foods, calories, day_of_week
                        ) VALUES ($1, $2, $3, $4, $5)`,
                        [
                            newPlan.id,
                            meal.meal_time,
                            JSON.stringify(meal.foods),
                            meal.calories,
                            meal.day_of_week
                        ]
                    );
                }

                // Client bilgisini al
                const clientInfo = clientsCheck.rows.find(c => c.id === clientId);
                const clientName = clientInfo ? `${clientInfo.first_name} ${clientInfo.last_name}` : 'Danışan';

                // Aktivite logu
                await createActivityLog(
                    dietitianId,
                    clientId,
                    'diet_plan',
                    'create',
                    `${clientName} için "${template.title}" şablonu atandı`
                );

                assignedPlans.push({
                    client_id: clientId,
                    client_name: clientName,
                    plan_id: newPlan.id,
                    plan_title: newPlan.title
                });
            }

            await client.query("COMMIT");
            
            return {
                message: `${clientIds.length} danışana şablon başarıyla atandı`,
                assigned_plans: assignedPlans
            };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

