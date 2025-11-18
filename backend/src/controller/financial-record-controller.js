import FinancialRecordService from "../service/financial-record-service.js";

export default class FinancialRecordController {
    constructor() {
        this.financialRecordService = new FinancialRecordService();
    }

    async createRecord(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.financialRecordService.createRecord(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "Finansal kayıt başarıyla oluşturuldu",
                record: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecords(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status || null;
            const result = await this.financialRecordService.getRecords(dietitianId, clientId, page, limit, status);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecordById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const recordId = req.params.id;
            const result = await this.financialRecordService.getRecordById(dietitianId, recordId);
            res.status(200).json({
                success: true,
                record: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateRecord(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const recordId = req.params.id;
            const result = await this.financialRecordService.updateRecord(dietitianId, recordId, req.body);
            res.status(200).json({
                success: true,
                message: "Finansal kayıt güncellendi",
                record: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRecord(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const recordId = req.params.id;
            const result = await this.financialRecordService.deleteRecord(dietitianId, recordId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllRecords(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const status = req.query.status || null;
            const clientId = req.query.client_id || null;
            const result = await this.financialRecordService.getAllRecords(dietitianId, page, limit, status, clientId);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}

