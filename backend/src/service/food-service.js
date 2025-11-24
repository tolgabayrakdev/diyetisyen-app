import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";

export default class FoodService {
    
    async createFood(dietitianId, foodData) {
        const { category_id, name, description, unit, image_url, nutrients } = foodData;

        if (!name || name.trim().length === 0) {
            throw new HttpException(400, "Besin adı gereklidir");
        }

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Aynı isimde besin var mı kontrol et
            const existingResult = await client.query(
                "SELECT id FROM foods WHERE dietitian_id = $1 AND name = $2",
                [dietitianId, name.trim()]
            );

            if (existingResult.rows.length > 0) {
                throw new HttpException(409, "Bu isimde bir besin zaten mevcut");
            }

            // Kategori var mı ve sahibi doğru mu kontrol et
            if (category_id) {
                const categoryResult = await client.query(
                    "SELECT id FROM food_categories WHERE id = $1 AND dietitian_id = $2",
                    [category_id, dietitianId]
                );

                if (categoryResult.rows.length === 0) {
                    throw new HttpException(404, "Kategori bulunamadı");
                }
            }

            // Besini oluştur
            const foodResult = await client.query(
                `INSERT INTO foods (dietitian_id, category_id, name, description, unit, image_url)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [
                    dietitianId,
                    category_id || null,
                    name.trim(),
                    description || null,
                    unit || '100g',
                    image_url || null
                ]
            );

            const food = foodResult.rows[0];

            // Besin değerlerini ekle
            if (nutrients) {
                await this.insertNutrients(client, food.id, nutrients);
            }

            await client.query("COMMIT");

            // Aktivite logu oluştur (transaction dışında)
            await createActivityLog(
                dietitianId,
                null,
                'food',
                'create',
                `"${name.trim()}" besini eklendi`
            );

            // Besin değerleriyle birlikte döndür
            const foodWithNutrients = await this.getFoodById(dietitianId, food.id);
            return foodWithNutrients;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Besin oluşturulamadı: ${error.message}`);
        } finally {
            client.release();
        }
    }

    async getFoods(dietitianId, filters = {}) {
        const { category_id, search, page = 1, limit = 20, is_active = true } = filters;
        const offset = (page - 1) * limit;

        try {
            let query = `
                SELECT f.*, 
                       fc.name as category_name,
                       fc.icon as category_icon,
                       fc.color as category_color
                FROM foods f
                LEFT JOIN food_categories fc ON f.category_id = fc.id
                WHERE f.dietitian_id = $1
            `;
            const params = [dietitianId];
            let paramIndex = 2;

            if (is_active !== null && is_active !== undefined) {
                query += ` AND f.is_active = $${paramIndex++}`;
                params.push(is_active);
            }

            if (category_id) {
                query += ` AND f.category_id = $${paramIndex++}`;
                params.push(category_id);
            }

            if (search) {
                query += ` AND f.name ILIKE $${paramIndex++}`;
                params.push(`%${search}%`);
            }

            query += ` ORDER BY f.name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit, offset);

            const result = await pool.query(query, params);

            // Besin değerlerini ekle
            const foods = await Promise.all(
                result.rows.map(async (food) => {
                    const nutrients = await this.getNutrients(food.id);
                    return { ...food, nutrients };
                })
            );

            // Toplam sayıyı al
            let countQuery = `SELECT COUNT(*) FROM foods WHERE dietitian_id = $1`;
            const countParams = [dietitianId];
            let countParamIndex = 2;

            if (is_active !== null && is_active !== undefined) {
                countQuery += ` AND is_active = $${countParamIndex++}`;
                countParams.push(is_active);
            }

            if (category_id) {
                countQuery += ` AND category_id = $${countParamIndex++}`;
                countParams.push(category_id);
            }

            if (search) {
                countQuery += ` AND name ILIKE $${countParamIndex++}`;
                countParams.push(`%${search}%`);
            }

            const countResult = await pool.query(countQuery, countParams);
            const total = parseInt(countResult.rows[0].count);

            return {
                foods,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new HttpException(500, `Besinler alınamadı: ${error.message}`);
        }
    }

    async getFoodById(dietitianId, foodId) {
        try {
            const result = await pool.query(
                `SELECT f.*, 
                       fc.name as category_name,
                       fc.icon as category_icon,
                       fc.color as category_color
                FROM foods f
                LEFT JOIN food_categories fc ON f.category_id = fc.id
                WHERE f.id = $1 AND f.dietitian_id = $2`,
                [foodId, dietitianId]
            );

            if (result.rows.length === 0) {
                throw new HttpException(404, "Besin bulunamadı");
            }

            const food = result.rows[0];
            const nutrients = await this.getNutrients(foodId);

            return { ...food, nutrients };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Besin alınamadı: ${error.message}`);
        }
    }

    async updateFood(dietitianId, foodId, foodData) {
        const { category_id, name, description, unit, image_url, is_active, nutrients } = foodData;

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Besin var mı ve sahibi doğru mu kontrol et
            const existingResult = await client.query(
                "SELECT id FROM foods WHERE id = $1 AND dietitian_id = $2",
                [foodId, dietitianId]
            );

            if (existingResult.rows.length === 0) {
                throw new HttpException(404, "Besin bulunamadı");
            }

            // İsim değiştiriliyorsa, aynı isimde başka besin var mı kontrol et
            if (name && name.trim().length > 0) {
                const duplicateResult = await client.query(
                    "SELECT id FROM foods WHERE dietitian_id = $1 AND name = $2 AND id != $3",
                    [dietitianId, name.trim(), foodId]
                );

                if (duplicateResult.rows.length > 0) {
                    throw new HttpException(409, "Bu isimde bir besin zaten mevcut");
                }
            }

            // Kategori var mı ve sahibi doğru mu kontrol et
            if (category_id) {
                const categoryResult = await client.query(
                    "SELECT id FROM food_categories WHERE id = $1 AND dietitian_id = $2",
                    [category_id, dietitianId]
                );

                if (categoryResult.rows.length === 0) {
                    throw new HttpException(404, "Kategori bulunamadı");
                }
            }

            // Güncelleme alanlarını oluştur
            const updates = [];
            const values = [];
            let paramIndex = 1;

            if (category_id !== undefined) {
                updates.push(`category_id = $${paramIndex++}`);
                values.push(category_id || null);
            }
            if (name !== undefined) {
                updates.push(`name = $${paramIndex++}`);
                values.push(name.trim());
            }
            if (description !== undefined) {
                updates.push(`description = $${paramIndex++}`);
                values.push(description || null);
            }
            if (unit !== undefined) {
                updates.push(`unit = $${paramIndex++}`);
                values.push(unit || '100g');
            }
            if (image_url !== undefined) {
                updates.push(`image_url = $${paramIndex++}`);
                values.push(image_url || null);
            }
            if (is_active !== undefined) {
                updates.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }

            if (updates.length > 0) {
                updates.push(`updated_at = NOW()`);
                values.push(foodId, dietitianId);

                await client.query(
                    `UPDATE foods 
                     SET ${updates.join(', ')}
                     WHERE id = $${paramIndex} AND dietitian_id = $${paramIndex + 1}`,
                    values
                );
            }

            // Besin değerlerini güncelle
            if (nutrients) {
                await this.updateNutrients(client, foodId, nutrients);
            }

            await client.query("COMMIT");

            // Besin adını al
            const foodInfo = await pool.query(
                "SELECT name FROM foods WHERE id = $1",
                [foodId]
            );
            const foodName = foodInfo.rows[0]?.name || 'Besin';

            // Aktivite logu oluştur (transaction dışında)
            await createActivityLog(
                dietitianId,
                null,
                'food',
                'update',
                `"${foodName}" besini güncellendi`
            );

            // Güncellenmiş besini döndür
            const updatedFood = await this.getFoodById(dietitianId, foodId);
            return updatedFood;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Besin güncellenemedi: ${error.message}`);
        } finally {
            client.release();
        }
    }

    async deleteFood(dietitianId, foodId) {
        try {
            // Besin var mı ve sahibi doğru mu kontrol et
            const existingResult = await pool.query(
                "SELECT id, name FROM foods WHERE id = $1 AND dietitian_id = $2",
                [foodId, dietitianId]
            );

            if (existingResult.rows.length === 0) {
                throw new HttpException(404, "Besin bulunamadı");
            }

            const foodName = existingResult.rows[0].name;

            // Besin değerleri otomatik silinecek (CASCADE)
            await pool.query(
                "DELETE FROM foods WHERE id = $1 AND dietitian_id = $2",
                [foodId, dietitianId]
            );

            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                null,
                'food',
                'delete',
                `"${foodName}" besini silindi`
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Besin silinemedi: ${error.message}`);
        }
    }

    // Yardımcı metodlar
    async insertNutrients(client, foodId, nutrients) {
        const nutrientFields = [
            'energy_kcal', 'energy_kj', 'protein_g', 'carbohydrates_g', 'fat_g',
            'saturated_fat_g', 'trans_fat_g', 'fiber_g', 'sugar_g',
            'sodium_mg', 'salt_g', 'potassium_mg', 'calcium_mg', 'iron_mg',
            'magnesium_mg', 'phosphorus_mg', 'zinc_mg',
            'vitamin_a_mcg', 'vitamin_c_mg', 'vitamin_d_mcg', 'vitamin_e_mg',
            'vitamin_k_mcg', 'thiamin_mg', 'riboflavin_mg', 'niacin_mg',
            'vitamin_b6_mg', 'folate_mcg', 'vitamin_b12_mcg', 'biotin_mcg',
            'pantothenic_acid_mg', 'cholesterol_mg', 'caffeine_mg'
        ];

        // Tüm alanlar için değerleri hazırla
        const values = nutrientFields.map(field => nutrients[field] || null);
        values.push(foodId);

        // UPDATE için güncellenecek alanları hazırla
        const updateFields = nutrientFields.map((field, index) => `${field} = $${index + 1}`).join(', ');

        await client.query(
            `INSERT INTO food_nutrients (${nutrientFields.join(', ')}, food_id)
             VALUES (${nutrientFields.map((_, i) => `$${i + 1}`).join(', ')}, $${nutrientFields.length + 1})
             ON CONFLICT (food_id) DO UPDATE SET
             ${updateFields}, updated_at = NOW()`,
            values
        );
    }

    async updateNutrients(client, foodId, nutrients) {
        const nutrientFields = [
            'energy_kcal', 'energy_kj', 'protein_g', 'carbohydrates_g', 'fat_g',
            'saturated_fat_g', 'trans_fat_g', 'fiber_g', 'sugar_g',
            'sodium_mg', 'salt_g', 'potassium_mg', 'calcium_mg', 'iron_mg',
            'magnesium_mg', 'phosphorus_mg', 'zinc_mg',
            'vitamin_a_mcg', 'vitamin_c_mg', 'vitamin_d_mcg', 'vitamin_e_mg',
            'vitamin_k_mcg', 'thiamin_mg', 'riboflavin_mg', 'niacin_mg',
            'vitamin_b6_mg', 'folate_mcg', 'vitamin_b12_mcg', 'biotin_mcg',
            'pantothenic_acid_mg', 'cholesterol_mg', 'caffeine_mg'
        ];

        const updates = [];
        const values = [];
        let paramIndex = 1;

        nutrientFields.forEach(field => {
            if (nutrients[field] !== undefined) {
                updates.push(`${field} = $${paramIndex++}`);
                values.push(nutrients[field] || null);
            }
        });

        if (updates.length === 0) {
            return; // Güncellenecek alan yok
        }

        updates.push(`updated_at = NOW()`);
        values.push(foodId);

        // Önce kayıt var mı kontrol et
        const existingResult = await client.query(
            "SELECT id FROM food_nutrients WHERE food_id = $1",
            [foodId]
        );

        if (existingResult.rows.length === 0) {
            // Yeni kayıt oluştur
            await this.insertNutrients(client, foodId, nutrients);
        } else {
            // Mevcut kaydı güncelle
            await client.query(
                `UPDATE food_nutrients 
                 SET ${updates.join(', ')}
                 WHERE food_id = $${paramIndex}`,
                values
            );
        }
    }

    async getNutrients(foodId) {
        const result = await pool.query(
            "SELECT * FROM food_nutrients WHERE food_id = $1",
            [foodId]
        );

        return result.rows[0] || null;
    }
}

