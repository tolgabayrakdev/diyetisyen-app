import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";

export default class FoodCategoryService {
    
    async createCategory(dietitianId, categoryData) {
        const { name, description, icon, color, sort_order } = categoryData;

        if (!name || name.trim().length === 0) {
            throw new HttpException(400, "Kategori adı gereklidir");
        }

        try {
            // Aynı isimde kategori var mı kontrol et
            const existingResult = await pool.query(
                "SELECT id FROM food_categories WHERE dietitian_id = $1 AND name = $2",
                [dietitianId, name.trim()]
            );

            if (existingResult.rows.length > 0) {
                throw new HttpException(409, "Bu isimde bir kategori zaten mevcut");
            }

            const result = await pool.query(
                `INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [
                    dietitianId,
                    name.trim(),
                    description || null,
                    icon || null,
                    color || null,
                    sort_order || 0
                ]
            );

            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                null,
                'food_category',
                'create',
                `"${name.trim()}" kategorisi oluşturuldu`
            );

            return result.rows[0];
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Kategori oluşturulamadı: ${error.message}`);
        }
    }

    async getCategories(dietitianId) {
        try {
            const result = await pool.query(
                `SELECT fc.*, 
                        COUNT(f.id) as food_count
                 FROM food_categories fc
                 LEFT JOIN foods f ON fc.id = f.category_id AND f.is_active = true
                 WHERE fc.dietitian_id = $1
                 GROUP BY fc.id
                 ORDER BY fc.sort_order ASC, fc.name ASC`,
                [dietitianId]
            );

            return result.rows;
        } catch (error) {
            throw new HttpException(500, `Kategoriler alınamadı: ${error.message}`);
        }
    }

    async getCategoryById(dietitianId, categoryId) {
        try {
            const result = await pool.query(
                `SELECT fc.*, 
                        COUNT(f.id) as food_count
                 FROM food_categories fc
                 LEFT JOIN foods f ON fc.id = f.category_id AND f.is_active = true
                 WHERE fc.id = $1 AND fc.dietitian_id = $2
                 GROUP BY fc.id`,
                [categoryId, dietitianId]
            );

            if (result.rows.length === 0) {
                throw new HttpException(404, "Kategori bulunamadı");
            }

            return result.rows[0];
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Kategori alınamadı: ${error.message}`);
        }
    }

    async updateCategory(dietitianId, categoryId, categoryData) {
        const { name, description, icon, color, sort_order } = categoryData;

        try {
            // Kategori var mı ve sahibi doğru mu kontrol et
            const existingResult = await pool.query(
                "SELECT id FROM food_categories WHERE id = $1 AND dietitian_id = $2",
                [categoryId, dietitianId]
            );

            if (existingResult.rows.length === 0) {
                throw new HttpException(404, "Kategori bulunamadı");
            }

            // İsim değiştiriliyorsa, aynı isimde başka kategori var mı kontrol et
            if (name && name.trim().length > 0) {
                const duplicateResult = await pool.query(
                    "SELECT id FROM food_categories WHERE dietitian_id = $1 AND name = $2 AND id != $3",
                    [dietitianId, name.trim(), categoryId]
                );

                if (duplicateResult.rows.length > 0) {
                    throw new HttpException(409, "Bu isimde bir kategori zaten mevcut");
                }
            }

            // Güncelleme alanlarını oluştur
            const updates = [];
            const values = [];
            let paramIndex = 1;

            if (name !== undefined) {
                updates.push(`name = $${paramIndex++}`);
                values.push(name.trim());
            }
            if (description !== undefined) {
                updates.push(`description = $${paramIndex++}`);
                values.push(description || null);
            }
            if (icon !== undefined) {
                updates.push(`icon = $${paramIndex++}`);
                values.push(icon || null);
            }
            if (color !== undefined) {
                updates.push(`color = $${paramIndex++}`);
                values.push(color || null);
            }
            if (sort_order !== undefined) {
                updates.push(`sort_order = $${paramIndex++}`);
                values.push(sort_order);
            }

            if (updates.length === 0) {
                throw new HttpException(400, "Güncellenecek alan belirtilmedi");
            }

            // Kategori adını al
            const categoryInfo = await pool.query(
                "SELECT name FROM food_categories WHERE id = $1",
                [categoryId]
            );
            const categoryName = categoryInfo.rows[0]?.name || 'Kategori';

            updates.push(`updated_at = NOW()`);
            values.push(categoryId, dietitianId);

            const result = await pool.query(
                `UPDATE food_categories 
                 SET ${updates.join(', ')}
                 WHERE id = $${paramIndex} AND dietitian_id = $${paramIndex + 1}
                 RETURNING *`,
                values
            );

            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                null,
                'food_category',
                'update',
                `"${categoryName}" kategorisi güncellendi`
            );

            return result.rows[0];
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Kategori güncellenemedi: ${error.message}`);
        }
    }

    async deleteCategory(dietitianId, categoryId) {
        try {
            // Kategori var mı ve sahibi doğru mu kontrol et
            const existingResult = await pool.query(
                "SELECT id, name FROM food_categories WHERE id = $1 AND dietitian_id = $2",
                [categoryId, dietitianId]
            );

            if (existingResult.rows.length === 0) {
                throw new HttpException(404, "Kategori bulunamadı");
            }

            const categoryName = existingResult.rows[0].name;

            // Bu kategoriye ait besin var mı kontrol et
            const foodsResult = await pool.query(
                "SELECT COUNT(*) FROM foods WHERE category_id = $1",
                [categoryId]
            );

            const foodCount = parseInt(foodsResult.rows[0].count);
            if (foodCount > 0) {
                throw new HttpException(409, `Bu kategoriye ait ${foodCount} besin bulunmaktadır. Önce besinleri silin veya başka kategoriye taşıyın.`);
            }

            await pool.query(
                "DELETE FROM food_categories WHERE id = $1 AND dietitian_id = $2",
                [categoryId, dietitianId]
            );

            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                null,
                'food_category',
                'delete',
                `"${categoryName}" kategorisi silindi`
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, `Kategori silinemedi: ${error.message}`);
        }
    }
}

