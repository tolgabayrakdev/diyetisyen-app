import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";

export default class ClientDocumentService {
    
    async createDocument(dietitianId, clientId, documentData) {
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
                `INSERT INTO client_documents (
                    client_id, file_url, file_type, description
                ) VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [
                    clientId,
                    documentData.file_url,
                    documentData.file_type || null,
                    documentData.description || null
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

    async getDocuments(dietitianId, clientId) {
        // Danışanın bu diyetisyene ait olduğunu kontrol et
        const clientCheck = await pool.query(
            `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (clientCheck.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        const result = await pool.query(
            `SELECT * FROM client_documents 
             WHERE client_id = $1 
             ORDER BY uploaded_at DESC`,
            [clientId]
        );

        return result.rows;
    }

    async getDocumentById(dietitianId, documentId) {
        const result = await pool.query(
            `SELECT cd.* FROM client_documents cd
             INNER JOIN clients c ON cd.client_id = c.id
             WHERE cd.id = $1 AND c.dietitian_id = $2`,
            [documentId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Belge bulunamadı");
        }

        return result.rows[0];
    }

    async updateDocument(dietitianId, documentId, documentData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Belgenin bu diyetisyene ait olduğunu kontrol et
            const existingDoc = await client.query(
                `SELECT cd.id FROM client_documents cd
                 INNER JOIN clients c ON cd.client_id = c.id
                 WHERE cd.id = $1 AND c.dietitian_id = $2`,
                [documentId, dietitianId]
            );

            if (existingDoc.rows.length === 0) {
                throw new HttpException(404, "Belge bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            const allowedFields = ['file_url', 'file_type', 'description'];
            allowedFields.forEach(field => {
                if (documentData[field] !== undefined) {
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(documentData[field]);
                }
            });

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateValues.push(documentId);

            const query = `
                UPDATE client_documents 
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

    async deleteDocument(dietitianId, documentId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Belgenin bu diyetisyene ait olduğunu kontrol et
            const existingDoc = await client.query(
                `SELECT cd.id FROM client_documents cd
                 INNER JOIN clients c ON cd.client_id = c.id
                 WHERE cd.id = $1 AND c.dietitian_id = $2`,
                [documentId, dietitianId]
            );

            if (existingDoc.rows.length === 0) {
                throw new HttpException(404, "Belge bulunamadı");
            }

            await client.query(
                `DELETE FROM client_documents WHERE id = $1`,
                [documentId]
            );

            await client.query("COMMIT");
            return { message: "Belge başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

