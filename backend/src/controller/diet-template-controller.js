import DietTemplateService from "../service/diet-template-service.js";
import { saveBase64Pdf, deleteFile } from "../util/file-upload.js";

export default class DietTemplateController {
    constructor() {
        this.dietTemplateService = new DietTemplateService();
    }

    /**
     * Yeni diyet şablonu oluştur
     */
    async createTemplate(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateData = { ...req.body };
            
            // Eğer PDF base64 string olarak geliyorsa, Cloudinary'e yükle
            if (templateData.pdf_base64) {
                try {
                    const pdfUrl = await saveBase64Pdf(templateData.pdf_base64, templateData.pdf_file_name);
                    templateData.pdf_url = pdfUrl;
                    delete templateData.pdf_base64; // Base64 string'i temizle
                    delete templateData.pdf_file_name; // File name'i temizle
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: `PDF yüklenemedi: ${error.message}`
                    });
                }
            }
            
            const result = await this.dietTemplateService.createTemplate(dietitianId, templateData);
            res.status(201).json({
                success: true,
                message: "Diyet şablonu başarıyla oluşturuldu",
                template: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Diyetisyenin tüm şablonlarını listele
     */
    async getTemplates(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const filters = {
                category: req.query.category,
                is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
                search: req.query.search
            };
            const result = await this.dietTemplateService.getTemplates(dietitianId, filters);
            res.status(200).json({
                success: true,
                templates: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablon detayını getir (öğünlerle birlikte)
     */
    async getTemplateById(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateId = req.params.id;
            const result = await this.dietTemplateService.getTemplateById(dietitianId, templateId);
            res.status(200).json({
                success: true,
                template: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablonu güncelle
     */
    async updateTemplate(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateId = req.params.id;
            const templateData = { ...req.body };
            
            // Eğer yeni PDF yükleniyorsa
            if (templateData.pdf_base64) {
                try {
                    // Eski PDF'i sil (varsa)
                    const existingTemplate = await this.dietTemplateService.getTemplateById(dietitianId, templateId);
                    if (existingTemplate.pdf_url) {
                        await deleteFile(existingTemplate.pdf_url);
                    }
                    
                    // Yeni PDF'i Cloudinary'e yükle
                    const pdfUrl = await saveBase64Pdf(templateData.pdf_base64, templateData.pdf_file_name);
                    templateData.pdf_url = pdfUrl;
                    delete templateData.pdf_base64;
                    delete templateData.pdf_file_name;
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: `PDF yüklenemedi: ${error.message}`
                    });
                }
            }
            
            const result = await this.dietTemplateService.updateTemplate(dietitianId, templateId, templateData);
            res.status(200).json({
                success: true,
                message: "Diyet şablonu güncellendi",
                template: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablonu sil
     */
    async deleteTemplate(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateId = req.params.id;
            
            // Şablonu silmeden önce PDF'i Cloudinary'den sil
            try {
                const existingTemplate = await this.dietTemplateService.getTemplateById(dietitianId, templateId);
                if (existingTemplate.pdf_url) {
                    await deleteFile(existingTemplate.pdf_url);
                }
            } catch (error) {
                // PDF silme hatası kritik değil, devam et
                console.error("PDF silinirken hata:", error);
            }
            
            const result = await this.dietTemplateService.deleteTemplate(dietitianId, templateId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablona öğün ekle
     */
    async addMealToTemplate(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateId = req.params.templateId;
            const result = await this.dietTemplateService.addMealToTemplate(dietitianId, templateId, req.body);
            res.status(201).json({
                success: true,
                message: "Öğün başarıyla eklendi",
                meal: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablon öğününü güncelle
     */
    async updateTemplateMeal(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const mealId = req.params.mealId;
            const result = await this.dietTemplateService.updateTemplateMeal(dietitianId, mealId, req.body);
            res.status(200).json({
                success: true,
                message: "Öğün güncellendi",
                meal: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablon öğününü sil
     */
    async deleteTemplateMeal(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const mealId = req.params.mealId;
            const result = await this.dietTemplateService.deleteTemplateMeal(dietitianId, mealId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Şablonu danışanlara ata
     */
    async assignTemplateToClients(req, res, next) {
        try {
            const dietitianId = req.user.id;
            const templateId = req.params.templateId;
            const { client_ids, title, description, start_date, end_date } = req.body;

            if (!client_ids || !Array.isArray(client_ids) || client_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "En az bir danışan ID'si gereklidir"
                });
            }

            const result = await this.dietTemplateService.assignTemplateToClients(
                dietitianId,
                templateId,
                client_ids,
                { title, description, start_date, end_date }
            );

            res.status(200).json({
                success: true,
                message: result.message,
                assigned_plans: result.assigned_plans
            });
        } catch (error) {
            next(error);
        }
    }
}

