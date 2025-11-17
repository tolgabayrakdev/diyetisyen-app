import ClientNoteService from "../service/client-note-service.js";

export default class ClientNoteController {
    constructor() {
        this.clientNoteService = new ClientNoteService();
    }

    async createNote(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.clientNoteService.createNote(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "Not başarıyla oluşturuldu",
                note: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getNotes(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await this.clientNoteService.getNotes(dietitianId, clientId, page, limit);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getNoteById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const noteId = req.params.id;
            const result = await this.clientNoteService.getNoteById(dietitianId, noteId);
            res.status(200).json({
                success: true,
                note: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateNote(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const noteId = req.params.id;
            const result = await this.clientNoteService.updateNote(dietitianId, noteId, req.body);
            res.status(200).json({
                success: true,
                message: "Not güncellendi",
                note: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteNote(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const noteId = req.params.id;
            const result = await this.clientNoteService.deleteNote(dietitianId, noteId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

