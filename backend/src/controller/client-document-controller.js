import ClientDocumentService from "../service/client-document-service.js";

export default class ClientDocumentController {
    constructor() {
        this.clientDocumentService = new ClientDocumentService();
    }

    async createDocument(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.clientDocumentService.createDocument(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "Belge başarıyla eklendi",
                document: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDocuments(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.clientDocumentService.getDocuments(dietitianId, clientId);
            res.status(200).json({
                success: true,
                documents: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDocumentById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const documentId = req.params.id;
            const result = await this.clientDocumentService.getDocumentById(dietitianId, documentId);
            res.status(200).json({
                success: true,
                document: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDocument(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const documentId = req.params.id;
            const result = await this.clientDocumentService.updateDocument(dietitianId, documentId, req.body);
            res.status(200).json({
                success: true,
                message: "Belge güncellendi",
                document: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDocument(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const documentId = req.params.id;
            const result = await this.clientDocumentService.deleteDocument(dietitianId, documentId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

