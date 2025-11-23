import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class ActivityLogService {
    
    async getLogs(dietitianId, clientId = null, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT al.*, 
                   c.first_name as client_first_name, 
                   c.last_name as client_last_name
            FROM activity_logs al
            LEFT JOIN clients c ON al.client_id = c.id
            WHERE al.user_id = $1
        `;
        const params = [dietitianId];
        let paramIndex = 2;

        if (clientId) {
            query += ` AND al.client_id = $${paramIndex++}`;
            params.push(clientId);
        }

        query += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Toplam sayıyı al
        let countQuery = `SELECT COUNT(*) FROM activity_logs WHERE user_id = $1`;
        const countParams = [dietitianId];
        if (clientId) {
            countQuery += ` AND client_id = $2`;
            countParams.push(clientId);
        }
        const countResult = await pool.query(countQuery, countParams);
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
            `SELECT al.*, 
                    c.first_name as client_first_name, 
                    c.last_name as client_last_name
             FROM activity_logs al
             LEFT JOIN clients c ON al.client_id = c.id
             WHERE al.id = $1 AND al.user_id = $2`,
            [logId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Aktivite logu bulunamadı");
        }

        return result.rows[0];
    }

    async getLogsByEntity(dietitianId, entityType, entityId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        
        // Entity tipine göre farklı sorgular
        let query = `
            SELECT al.*, 
                   c.first_name as client_first_name, 
                   c.last_name as client_last_name
            FROM activity_logs al
            LEFT JOIN clients c ON al.client_id = c.id
            WHERE al.user_id = $1 AND al.entity_type = $2
        `;
        const params = [dietitianId, entityType];
        let paramIndex = 3;

        // Entity ID'ye göre filtreleme (eğer client_id ile eşleşiyorsa)
        if (entityId && entityType !== 'client') {
            query += ` AND al.client_id = $${paramIndex++}`;
            params.push(entityId);
        } else if (entityId && entityType === 'client') {
            query += ` AND al.client_id = $${paramIndex++}`;
            params.push(entityId);
        }

        query += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Toplam sayıyı al
        let countQuery = `SELECT COUNT(*) FROM activity_logs WHERE user_id = $1 AND entity_type = $2`;
        const countParams = [dietitianId, entityType];
        if (entityId) {
            countQuery += ` AND client_id = $3`;
            countParams.push(entityId);
        }
        const countResult = await pool.query(countQuery, countParams);
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

    async getAllLogs(dietitianId) {
        const query = `
            SELECT al.*, 
                   c.first_name as client_first_name, 
                   c.last_name as client_last_name
            FROM activity_logs al
            LEFT JOIN clients c ON al.client_id = c.id
            WHERE al.user_id = $1
            ORDER BY al.created_at DESC
        `;
        const result = await pool.query(query, [dietitianId]);
        return result.rows;
    }
}

