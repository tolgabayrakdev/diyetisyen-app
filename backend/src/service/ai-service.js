import HttpException from "../exceptions/http-exception.js";
import logger from "../config/logger.js";

export default class AIService {
    constructor() {
        // Groq API key'i environment variable'dan al (ücretsiz)
        // Groq API: https://console.groq.com/
        this.apiKey = process.env.GROQ_API_KEY;
        this.baseURL = "https://api.groq.com/openai/v1";
        
        if (!this.apiKey) {
            logger.warn("⚠️  GROQ_API_KEY not found. AI features will be disabled.");
        }
    }

    /**
     * Kilo değişimini özetler
     * @param {Array} progressLogs - İlerleme kayıtları
     * @param {Object} client - Danışan bilgileri
     * @returns {Promise<string>} - AI tarafından oluşturulan özet
     */
    async summarizeWeightChange(progressLogs, client) {
        if (!this.apiKey) {
            throw new HttpException(503, "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
        }

        try {
            // Kilo verilerini hazırla
            const weightData = progressLogs
                .filter(log => log.weight_kg !== null)
                .map(log => ({
                    date: log.log_date,
                    weight: log.weight_kg,
                    bodyFat: log.body_fat_percent,
                    muscleMass: log.muscle_mass_kg
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (weightData.length < 2) {
                throw new HttpException(400, "Kilo değişimini özetlemek için en az 2 kayıt gereklidir.");
            }

            const firstWeight = weightData[0].weight;
            const lastWeight = weightData[weightData.length - 1].weight;
            const totalChange = lastWeight - firstWeight;
            const changePercent = ((totalChange / firstWeight) * 100).toFixed(1);

            // AI prompt'u oluştur
            const prompt = `Sen bir diyetisyen asistanısın. Aşağıdaki danışanın kilo değişim verilerini analiz et ve kısa, profesyonel bir özet hazırla.

Danışan Bilgileri:
- Ad Soyad: ${client.first_name} ${client.last_name}
- Boy: ${client.height_cm || 'Bilinmiyor'} cm
- İlk Kilo: ${firstWeight} kg
- Son Kilo: ${lastWeight} kg
- Toplam Değişim: ${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)} kg (${changePercent > 0 ? '+' : ''}${changePercent}%)

Kilo Kayıtları:
${weightData.map((d, i) => `${i + 1}. ${new Date(d.date).toLocaleDateString('tr-TR')}: ${d.weight} kg${d.bodyFat ? ` (Vücut Yağı: %${d.bodyFat})` : ''}${d.muscleMass ? ` (Kas: ${d.muscleMass} kg)` : ''}`).join('\n')}

Lütfen şunları içeren kısa bir özet hazırla (maksimum 150 kelime):
1. Genel kilo değişimi trendi
2. Değişimin hızı ve tutarlılığı
3. Varsa dikkat çekici noktalar
4. Kısa bir motivasyonel mesaj

Türkçe yanıt ver ve profesyonel bir dil kullan.`;

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // Groq'un ücretsiz modeli
                    messages: [
                        {
                            role: "system",
                            content: "Sen profesyonel bir diyetisyen asistanısın. Kilo değişim verilerini analiz edip kısa, anlaşılır ve motivasyonel özetler hazırlıyorsun."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500 // Artırıldı: 300 -> 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
            }

            const completion = await response.json();
            const choice = completion.choices[0];
            
            // Yanıtın kesilip kesilmediğini kontrol et
            if (choice.finish_reason === "length") {
                logger.warn("AI response was truncated due to max_tokens limit");
                // Kesilmiş yanıtı döndür ama log'a kaydet
            }
            
            return choice.message.content.trim();
        } catch (error) {
            logger.error("AI weight summary error:", error);
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, "Kilo değişimi özeti oluşturulurken bir hata oluştu.");
        }
    }

    /**
     * Haftalık ilerlemeyi yorumlar
     * @param {Array} progressLogs - Son haftanın ilerleme kayıtları
     * @param {Object} client - Danışan bilgileri
     * @returns {Promise<string>} - AI tarafından oluşturulan yorum
     */
    async commentWeeklyProgress(progressLogs, client) {
        if (!this.apiKey) {
            throw new HttpException(503, "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
        }

        try {
            // Son 7 günün kayıtlarını al
            const now = new Date();
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const weeklyLogs = progressLogs
                .filter(log => {
                    const logDate = new Date(log.log_date);
                    return logDate >= sevenDaysAgo && logDate <= now;
                })
                .map(log => ({
                    date: log.log_date,
                    weight: log.weight_kg,
                    bodyFat: log.body_fat_percent,
                    muscleMass: log.muscle_mass_kg,
                    notes: log.notes
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (weeklyLogs.length === 0) {
                throw new HttpException(400, "Son hafta için ilerleme kaydı bulunamadı.");
            }

            // Önceki hafta ile karşılaştırma için 7-14 gün öncesini al
            const twoWeeksAgo = new Date(now);
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            const previousWeekLogs = progressLogs
                .filter(log => {
                    const logDate = new Date(log.log_date);
                    return logDate >= twoWeeksAgo && logDate < sevenDaysAgo;
                })
                .map(log => ({
                    date: log.log_date,
                    weight: log.weight_kg,
                    bodyFat: log.body_fat_percent,
                    muscleMass: log.muscle_mass_kg
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const weeklyAvgWeight = weeklyLogs
                .filter(l => l.weight !== null)
                .reduce((sum, l) => sum + l.weight, 0) / weeklyLogs.filter(l => l.weight !== null).length;

            const previousAvgWeight = previousWeekLogs.length > 0 && previousWeekLogs.some(l => l.weight !== null)
                ? previousWeekLogs
                    .filter(l => l.weight !== null)
                    .reduce((sum, l) => sum + l.weight, 0) / previousWeekLogs.filter(l => l.weight !== null).length
                : null;

            // AI prompt'u oluştur
            const prompt = `Sen bir diyetisyen asistanısın. Aşağıdaki danışanın son haftalık ilerleme verilerini analiz et ve kısa, yapıcı bir yorum hazırla.

Danışan Bilgileri:
- Ad Soyad: ${client.first_name} ${client.last_name}
- Boy: ${client.height_cm || 'Bilinmiyor'} cm

Son Hafta Kayıtları (${weeklyLogs.length} kayıt):
${weeklyLogs.map((d, i) => `${i + 1}. ${new Date(d.date).toLocaleDateString('tr-TR')}: ${d.weight !== null ? `${d.weight} kg` : 'Kilo yok'}${d.bodyFat !== null ? `, Vücut Yağı: %${d.bodyFat}` : ''}${d.muscleMass !== null ? `, Kas: ${d.muscleMass} kg` : ''}${d.notes ? `\n   Not: ${d.notes}` : ''}`).join('\n')}

${previousAvgWeight ? `Önceki Hafta Ortalama: ${previousAvgWeight.toFixed(1)} kg` : ''}
Bu Hafta Ortalama: ${weeklyAvgWeight ? weeklyAvgWeight.toFixed(1) + ' kg' : 'Hesaplanamadı'}

Lütfen şunları içeren kısa bir yorum hazırla (maksimum 120 kelime):
1. Bu haftanın genel değerlendirmesi
2. Trend analizi (iyileşme, duraklama, gerileme)
3. Varsa dikkat çekici noktalar
4. Kısa bir öneri veya motivasyonel mesaj

Türkçe yanıt ver, pozitif ve yapıcı bir dil kullan.`;

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // Groq'un ücretsiz modeli
                    messages: [
                        {
                            role: "system",
                            content: "Sen profesyonel bir diyetisyen asistanısın. Haftalık ilerleme verilerini analiz edip yapıcı, motivasyonel ve kısa yorumlar hazırlıyorsun."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 400 // Artırıldı: 250 -> 400
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
            }

            const completion = await response.json();
            const choice = completion.choices[0];
            
            // Yanıtın kesilip kesilmediğini kontrol et
            if (choice.finish_reason === "length") {
                logger.warn("AI response was truncated due to max_tokens limit");
                // Kesilmiş yanıtı döndür ama log'a kaydet
            }
            
            return choice.message.content.trim();
        } catch (error) {
            logger.error("AI weekly progress comment error:", error);
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, "Haftalık ilerleme yorumu oluşturulurken bir hata oluştu.");
        }
    }
}

