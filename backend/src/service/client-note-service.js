import pool from "../config/database.js";
import HttpException from "../exceptions/http-exception.js";
import { createActivityLog } from "../util/activity-log.js";

export default class ClientNoteService {
    
    async createNote(dietitianId, clientId, noteData) {
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
                `INSERT INTO client_notes (
                    client_id, note_type, content
                ) VALUES ($1, $2, $3)
                RETURNING *`,
                [
                    clientId,
                    noteData.note_type || null,
                    noteData.content
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
            const newNote = result.rows[0];
            await createActivityLog(
                dietitianId,
                clientId,
                'note',
                'create',
                `${clientName} için not eklendi`
            );
            
            return newNote;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    async getNotes(dietitianId, clientId, page = 1, limit = 10) {
        // Danışanın bu diyetisyene ait olduğunu kontrol et
        const clientCheck = await pool.query(
            `SELECT id FROM clients WHERE id = $1 AND dietitian_id = $2`,
            [clientId, dietitianId]
        );

        if (clientCheck.rows.length === 0) {
            throw new HttpException(404, "Danışan bulunamadı");
        }

        const offset = (page - 1) * limit;
        const result = await pool.query(
            `SELECT * FROM client_notes 
             WHERE client_id = $1 
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [clientId, limit, offset]
        );

        // Toplam sayıyı al
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM client_notes WHERE client_id = $1`,
            [clientId]
        );
        const total = parseInt(countResult.rows[0].count);

        return {
            notes: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getNoteById(dietitianId, noteId) {
        const result = await pool.query(
            `SELECT cn.* FROM client_notes cn
             INNER JOIN clients c ON cn.client_id = c.id
             WHERE cn.id = $1 AND c.dietitian_id = $2`,
            [noteId, dietitianId]
        );

        if (result.rows.length === 0) {
            throw new HttpException(404, "Not bulunamadı");
        }

        return result.rows[0];
    }

    async updateNote(dietitianId, noteId, noteData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Notun bu diyetisyene ait olduğunu kontrol et
            const existingNote = await client.query(
                `SELECT cn.id FROM client_notes cn
                 INNER JOIN clients c ON cn.client_id = c.id
                 WHERE cn.id = $1 AND c.dietitian_id = $2`,
                [noteId, dietitianId]
            );

            if (existingNote.rows.length === 0) {
                throw new HttpException(404, "Not bulunamadı");
            }

            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            if (noteData.note_type !== undefined) {
                updateFields.push(`note_type = $${paramIndex++}`);
                updateValues.push(noteData.note_type);
            }

            if (noteData.content !== undefined) {
                updateFields.push(`content = $${paramIndex++}`);
                updateValues.push(noteData.content);
            }

            if (updateFields.length === 0) {
                throw new HttpException(400, "Güncellenecek alan bulunamadı");
            }

            updateValues.push(noteId);

            const query = `
                UPDATE client_notes 
                SET ${updateFields.join(", ")}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await client.query(query, updateValues);
            
            // Danışan bilgilerini al
            const clientInfo = await client.query(
                `SELECT c.first_name, c.last_name FROM clients c
                 INNER JOIN client_notes cn ON c.id = cn.client_id
                 WHERE cn.id = $1`,
                [noteId]
            );
            const clientName = clientInfo.rows[0] ? `${clientInfo.rows[0].first_name} ${clientInfo.rows[0].last_name}` : 'Danışan';
            
            await client.query("COMMIT");
            
            // Aktivite logu oluştur (transaction dışında)
            const updatedNote = result.rows[0];
            await createActivityLog(
                dietitianId,
                updatedNote.client_id,
                'note',
                'update',
                `${clientName} için not güncellendi`
            );
            
            return updatedNote;
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }

    async deleteNote(dietitianId, noteId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Notun bu diyetisyene ait olduğunu kontrol et
            const existingNote = await client.query(
                `SELECT cn.id FROM client_notes cn
                 INNER JOIN clients c ON cn.client_id = c.id
                 WHERE cn.id = $1 AND c.dietitian_id = $2`,
                [noteId, dietitianId]
            );

            if (existingNote.rows.length === 0) {
                throw new HttpException(404, "Not bulunamadı");
            }

            // Silinmeden önce not ve danışan bilgilerini al
            const noteInfo = await client.query(
                `SELECT cn.client_id, c.first_name, c.last_name 
                 FROM client_notes cn
                 INNER JOIN clients c ON cn.client_id = c.id
                 WHERE cn.id = $1`,
                [noteId]
            );
            const clientName = noteInfo.rows[0] ? `${noteInfo.rows[0].first_name} ${noteInfo.rows[0].last_name}` : 'Danışan';
            const clientId = noteInfo.rows[0]?.client_id;

            await client.query(
                `DELETE FROM client_notes WHERE id = $1`,
                [noteId]
            );

            await client.query("COMMIT");
            
            // Aktivite logu oluştur
            await createActivityLog(
                dietitianId,
                clientId,
                'note',
                'delete',
                `${clientName} için not silindi`
            );
            
            return { message: "Not başarıyla silindi" };
        } catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, error.message);
        } finally {
            client.release();
        }
    }
}

