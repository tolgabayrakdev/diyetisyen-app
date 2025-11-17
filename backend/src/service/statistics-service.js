import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class StatisticsService {
    
    async getStatistics(dietitianId) {
        try {
            // Toplam danışan sayısı
            const clientsResult = await pool.query(
                `SELECT COUNT(*) FROM clients WHERE dietitian_id = $1`,
                [dietitianId]
            );
            const totalClients = parseInt(clientsResult.rows[0].count);

            // Toplam diyet planı sayısı (tüm danışanlar için)
            const dietPlansResult = await pool.query(
                `SELECT COUNT(*) FROM diet_plans dp
                 INNER JOIN clients c ON dp.client_id = c.id
                 WHERE c.dietitian_id = $1`,
                [dietitianId]
            );
            const totalDietPlans = parseInt(dietPlansResult.rows[0].count);

            // Toplam not sayısı (tüm danışanlar için)
            const notesResult = await pool.query(
                `SELECT COUNT(*) FROM client_notes cn
                 INNER JOIN clients c ON cn.client_id = c.id
                 WHERE c.dietitian_id = $1`,
                [dietitianId]
            );
            const totalNotes = parseInt(notesResult.rows[0].count);

            // Toplam finansal kayıt sayısı (tüm danışanlar için)
            const financialResult = await pool.query(
                `SELECT COUNT(*) FROM financial_records fr
                 INNER JOIN clients c ON fr.client_id = c.id
                 WHERE c.dietitian_id = $1`,
                [dietitianId]
            );
            const totalFinancial = parseInt(financialResult.rows[0].count);

            return {
                totalClients,
                totalDietPlans,
                totalNotes,
                totalFinancial
            };
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    }
}

