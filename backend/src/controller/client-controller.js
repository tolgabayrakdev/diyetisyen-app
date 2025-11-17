import ClientService from "../service/client-service.js";

export default class ClientController {
    constructor() {
        this.clientService = new ClientService();
    }

    async createClient(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const result = await this.clientService.createClient(dietitianId, req.body);
            res.status(201).json({
                success: true,
                message: "Danışan başarıyla oluşturuldu",
                client: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getClients(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            const result = await this.clientService.getClients(dietitianId, page, limit, search);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getClientById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.id;
            const result = await this.clientService.getClientById(dietitianId, clientId);
            res.status(200).json({
                success: true,
                client: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateClient(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.id;
            const result = await this.clientService.updateClient(dietitianId, clientId, req.body);
            res.status(200).json({
                success: true,
                message: "Danışan bilgileri güncellendi",
                client: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteClient(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.id;
            const result = await this.clientService.deleteClient(dietitianId, clientId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

