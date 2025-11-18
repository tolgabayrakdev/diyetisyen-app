import cloudinary from "../config/cloudinary.js";
import HttpException from "../exceptions/http-exception.js";

/**
 * Base64 string'den PDF dosyası oluştur ve Cloudinary'e yükle
 * @param {string} base64String - Base64 encoded PDF string
 * @param {string} fileName - Dosya adı (opsiyonel)
 * @returns {Promise<string>} - Cloudinary'deki dosyanın URL'i
 */
export async function saveBase64Pdf(base64String, fileName = null) {
    try {
        // Base64 string'i temizle (data:application/pdf;base64, prefix'ini kaldır)
        const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
        
        // Base64 string'i buffer'a çevir
        const buffer = Buffer.from(base64Data, "base64");
        
        // Dosya adını oluştur
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const publicId = fileName 
            ? `diet-templates/${fileName.replace(/\.pdf$/i, "")}-${timestamp}`
            : `diet-templates/diet-template-${timestamp}-${randomString}`;

        // Cloudinary'e yükle - upload_stream kullanarak buffer gönder
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto", // Cloudinary otomatik olarak PDF'yi algılar
                    public_id: publicId,
                    folder: "diet-templates",
                    format: "pdf",
                },
                (error, result) => {
                    if (error) {
                        reject(new HttpException(500, `PDF Cloudinary'e yüklenemedi: ${error.message}`));
                    } else {
                        resolve(result.secure_url); // HTTPS URL'i döndür
                    }
                }
            );
            
            // Buffer'ı stream'e yaz
            uploadStream.end(buffer);
        });
    } catch (error) {
        throw new HttpException(500, `PDF Cloudinary'e yüklenemedi: ${error.message}`);
    }
}

/**
 * Cloudinary'den dosyayı sil
 * @param {string} fileUrl - Silinecek dosyanın Cloudinary URL'i
 */
export async function deleteFile(fileUrl) {
    try {
        if (!fileUrl) return;
        
        // Cloudinary URL'den public_id'yi çıkar
        // Cloudinary URL formatı: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{public_id}.pdf
        let publicId;
        try {
            // Cloudinary'in kendi utility fonksiyonunu kullan
            publicId = cloudinary.utils.extractPublicId(fileUrl);
        } catch (error) {
            // Fallback: Manuel parsing
            const urlParts = fileUrl.split("/");
            const uploadIndex = urlParts.findIndex(part => part === "upload");
            
            if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
                console.warn("Geçersiz Cloudinary URL:", fileUrl);
                return;
            }
            
            // public_id'yi bul (upload'dan sonraki kısım, version varsa ondan sonra)
            const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/");
            // Version varsa (v1234567890 formatında) onu atla
            const parts = pathAfterUpload.split("/");
            let publicIdIndex = 0;
            if (parts[0] && parts[0].startsWith("v") && /^v\d+$/.test(parts[0])) {
                publicIdIndex = 1;
            }
            publicId = parts.slice(publicIdIndex).join("/").replace(/\.pdf$/i, "");
        }
        
        // Cloudinary'den sil
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto" // PDF için auto kullan
        });
    } catch (error) {
        // Silme hatası kritik değil, logla
        console.error("Cloudinary'den dosya silinirken hata:", error);
    }
}

/**
 * PDF dosyasını Cloudinary'de kopyala (şablon atama için)
 * @param {string} sourceUrl - Kaynak dosya Cloudinary URL'i
 * @param {string} newFileName - Yeni dosya adı (opsiyonel)
 * @returns {Promise<string>} - Yeni dosyanın Cloudinary URL'i
 */
export async function copyPdfFile(sourceUrl, newFileName = null) {
    try {
        if (!sourceUrl) return null;
        
        // Kaynak URL'den public_id'yi çıkar (sadece doğrulama için, kullanmıyoruz)
        // Cloudinary URL'den direkt indirip yeniden yükleyeceğiz
        
        // Yeni public_id oluştur
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const newPublicId = newFileName
            ? `diet-templates/${newFileName.replace(/\.pdf$/i, "")}-${timestamp}`
            : `diet-templates/diet-template-${timestamp}-${randomString}`;
        
        // Cloudinary'de direkt kopyalama yok, bu yüzden URL'den indirip yeniden yükleyeceğiz
        const response = await fetch(sourceUrl);
        if (!response.ok) {
            throw new HttpException(400, "Kaynak dosya indirilemedi");
        }
        
        const buffer = await response.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);
        
        // Yeni dosyayı Cloudinary'e yükle - upload_stream kullanarak buffer gönder
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto", // Cloudinary otomatik olarak PDF'yi algılar
                    public_id: newPublicId,
                    folder: "diet-templates",
                    format: "pdf",
                },
                (error, result) => {
                    if (error) {
                        reject(new HttpException(500, `PDF Cloudinary'de kopyalanamadı: ${error.message}`));
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            
            // Buffer'ı stream'e yaz
            uploadStream.end(pdfBuffer);
        });
    } catch (error) {
        throw new HttpException(500, `PDF Cloudinary'de kopyalanamadı: ${error.message}`);
    }
}

