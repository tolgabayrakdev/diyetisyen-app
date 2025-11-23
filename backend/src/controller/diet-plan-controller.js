import DietPlanService from "../service/diet-plan-service.js";
import { saveBase64Pdf, deleteFile } from "../util/file-upload.js";
import logger from "../config/logger.js";

export default class DietPlanController {
    constructor() {
        this.dietPlanService = new DietPlanService();
    }

    async createDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.dietPlanService.createDietPlan(dietitianId, clientId, req.body);
            res.status(201).json({
                success: true,
                message: "Diyet planı başarıyla oluşturuldu",
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDietPlans(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const clientId = req.params.clientId;
            const result = await this.dietPlanService.getDietPlans(dietitianId, clientId);
            res.status(200).json({
                success: true,
                dietPlans: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getDietPlanById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const result = await this.dietPlanService.getDietPlanById(dietitianId, planId);
            res.status(200).json({
                success: true,
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const planData = { ...req.body };
            
            // Eğer yeni PDF yükleniyorsa
            if (planData.pdf_base64) {
                try {
                    // Eski PDF'i sil (varsa)
                    const existingPlan = await this.dietPlanService.getDietPlanById(dietitianId, planId);
                    if (existingPlan.pdf_url) {
                        await deleteFile(existingPlan.pdf_url);
                    }
                    
                    // Yeni PDF'i Cloudinary'e yükle
                    const pdfUrl = await saveBase64Pdf(planData.pdf_base64, planData.pdf_file_name, "diet-plans");
                    planData.pdf_url = pdfUrl;
                    delete planData.pdf_base64;
                    delete planData.pdf_file_name;
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: `PDF yüklenemedi: ${error.message}`
                    });
                }
            }
            
            // Eğer PDF siliniyorsa (pdf_url null olarak gönderilirse)
            if (planData.pdf_url === null || planData.pdf_url === "") {
                try {
                    const existingPlan = await this.dietPlanService.getDietPlanById(dietitianId, planId);
                    if (existingPlan.pdf_url) {
                        await deleteFile(existingPlan.pdf_url);
                    }
                    planData.pdf_url = null;
                } catch (error) {
                    // PDF silme hatası kritik değil, devam et
                    logger.warn("PDF silme hatası:", error);
                }
            }
            
            const result = await this.dietPlanService.updateDietPlan(dietitianId, planId, planData);
            res.status(200).json({
                success: true,
                message: "Diyet planı güncellendi",
                dietPlan: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDietPlan(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const planId = req.params.id;
            const result = await this.dietPlanService.deleteDietPlan(dietitianId, planId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

