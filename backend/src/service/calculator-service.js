import HttpException from "../exceptions/http-exception.js";

export default class CalculatorService {
    
    /**
     * BMI (Body Mass Index) Hesaplama
     * BMI = weight (kg) / (height (m))^2
     */
    calculateBMI(weightKg, heightCm) {
        if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
            throw new HttpException(400, "Kilo ve boy değerleri pozitif olmalıdır");
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        
        let category = "";
        let description = "";
        
        if (bmi < 18.5) {
            category = "Zayıf";
            description = "İdeal kilonuzun altındasınız. Sağlıklı kilo almak için bir diyetisyene danışın.";
        } else if (bmi < 25) {
            category = "Normal";
            description = "İdeal kilo aralığındasınız. Bu kiloyu korumaya devam edin.";
        } else if (bmi < 30) {
            category = "Fazla Kilolu";
            description = "İdeal kilonuzun üzerindesiniz. Sağlıklı kilo vermek için bir diyetisyene danışın.";
        } else {
            category = "Obez";
            description = "Obezite sınıfındasınız. Mutlaka bir diyetisyen ve doktor kontrolünde kilo vermelisiniz.";
        }

        return {
            bmi: parseFloat(bmi.toFixed(1)),
            category,
            description
        };
    }

    /**
     * BMR (Basal Metabolic Rate) - Bazal Metabolizma Hızı
     * Mifflin-St Jeor Formülü (daha doğru)
     * Erkek: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
     * Kadın: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
     */
    calculateBMR(weightKg, heightCm, age, gender, formula = 'mifflin') {
        if (!weightKg || !heightCm || !age || !gender) {
            throw new HttpException(400, "Tüm değerler girilmelidir");
        }

        if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
            throw new HttpException(400, "Kilo, boy ve yaş pozitif olmalıdır");
        }

        let bmr = 0;

        if (formula === 'mifflin') {
            // Mifflin-St Jeor Formülü
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
            } else {
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
            }
        } else if (formula === 'harris') {
            // Harris-Benedict Formülü (eski ama hala kullanılıyor)
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
            }
        } else {
            throw new HttpException(400, "Geçersiz formül. 'mifflin' veya 'harris' olmalıdır");
        }

        return {
            bmr: Math.round(bmr),
            formula: formula === 'mifflin' ? 'Mifflin-St Jeor' : 'Harris-Benedict',
            unit: 'kcal/gün'
        };
    }

    /**
     * TDEE (Total Daily Energy Expenditure) - Toplam Günlük Enerji Harcaması
     * TDEE = BMR × Activity Multiplier
     */
    calculateTDEE(bmr, activityLevel) {
        if (!bmr || bmr <= 0) {
            throw new HttpException(400, "BMR değeri geçerli olmalıdır");
        }

        const activityMultipliers = {
            'sedentary': { multiplier: 1.2, description: 'Hareketsiz (günlük egzersiz yok)' },
            'light': { multiplier: 1.375, description: 'Hafif aktif (haftada 1-3 gün hafif egzersiz)' },
            'moderate': { multiplier: 1.55, description: 'Orta aktif (haftada 3-5 gün orta egzersiz)' },
            'active': { multiplier: 1.725, description: 'Çok aktif (haftada 6-7 gün yoğun egzersiz)' },
            'very_active': { multiplier: 1.9, description: 'Aşırı aktif (günlük çok yoğun egzersiz, fiziksel iş)' }
        };

        const activity = activityMultipliers[activityLevel.toLowerCase()];
        if (!activity) {
            throw new HttpException(400, "Geçersiz aktivite seviyesi. 'sedentary', 'light', 'moderate', 'active', 'very_active' olmalıdır");
        }

        const tdee = Math.round(bmr * activity.multiplier);

        return {
            tdee,
            bmr,
            activityLevel: activity.description,
            multiplier: activity.multiplier,
            unit: 'kcal/gün'
        };
    }

    /**
     * Makro Besin Dağılımı Hesaplama
     * Protein: 1g = 4 kcal
     * Karbonhidrat: 1g = 4 kcal
     * Yağ: 1g = 9 kcal
     */
    calculateMacros(totalCalories, proteinPercent = 30, carbPercent = 40, fatPercent = 30) {
        if (!totalCalories || totalCalories <= 0) {
            throw new HttpException(400, "Toplam kalori pozitif olmalıdır");
        }

        // Yüzde kontrolü
        const totalPercent = proteinPercent + carbPercent + fatPercent;
        if (Math.abs(totalPercent - 100) > 0.1) {
            throw new HttpException(400, "Protein, karbonhidrat ve yağ yüzdeleri toplamı 100 olmalıdır");
        }

        // Kalori bazlı hesaplama
        const proteinCalories = (totalCalories * proteinPercent) / 100;
        const carbCalories = (totalCalories * carbPercent) / 100;
        const fatCalories = (totalCalories * fatPercent) / 100;

        // Gram bazlı hesaplama
        const proteinGrams = Math.round((proteinCalories / 4) * 10) / 10;
        const carbGrams = Math.round((carbCalories / 4) * 10) / 10;
        const fatGrams = Math.round((fatCalories / 9) * 10) / 10;

        return {
            totalCalories: Math.round(totalCalories),
            protein: {
                percent: proteinPercent,
                calories: Math.round(proteinCalories),
                grams: proteinGrams
            },
            carbohydrates: {
                percent: carbPercent,
                calories: Math.round(carbCalories),
                grams: carbGrams
            },
            fat: {
                percent: fatPercent,
                calories: Math.round(fatCalories),
                grams: fatGrams
            }
        };
    }

    /**
     * İdeal Kilo Hesaplama
     * Robinson, Miller, Devine, Hamwi formülleri
     */
    calculateIdealWeight(heightCm, gender, formula = 'robinson') {
        if (!heightCm || heightCm <= 0) {
            throw new HttpException(400, "Boy değeri pozitif olmalıdır");
        }

        const heightInches = heightCm / 2.54;
        let idealWeightKg = 0;
        let formulaName = '';

        if (formula === 'robinson') {
            // Robinson Formülü (1983)
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                idealWeightKg = 52 + (1.9 * (heightInches - 60));
            } else {
                idealWeightKg = 49 + (1.7 * (heightInches - 60));
            }
            formulaName = 'Robinson (1983)';
        } else if (formula === 'miller') {
            // Miller Formülü (1983)
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                idealWeightKg = 56.2 + (1.41 * (heightInches - 60));
            } else {
                idealWeightKg = 53.1 + (1.36 * (heightInches - 60));
            }
            formulaName = 'Miller (1983)';
        } else if (formula === 'devine') {
            // Devine Formülü (1974)
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                idealWeightKg = 50 + (2.3 * (heightInches - 60));
            } else {
                idealWeightKg = 45.5 + (2.3 * (heightInches - 60));
            }
            formulaName = 'Devine (1974)';
        } else if (formula === 'hamwi') {
            // Hamwi Formülü (1964)
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                idealWeightKg = 48 + (2.7 * (heightInches - 60));
            } else {
                idealWeightKg = 45.5 + (2.2 * (heightInches - 60));
            }
            formulaName = 'Hamwi (1964)';
        } else {
            throw new HttpException(400, "Geçersiz formül. 'robinson', 'miller', 'devine', 'hamwi' olmalıdır");
        }

        return {
            idealWeightKg: Math.round(idealWeightKg * 10) / 10,
            formula: formulaName,
            unit: 'kg'
        };
    }

    /**
     * Vücut Yağ Yüzdesi Hesaplama
     * Navy Method (ABD Donanması yöntemi)
     */
    calculateBodyFatPercent(weightKg, heightCm, age, gender, neckCm, waistCm, hipCm = null) {
        if (!weightKg || !heightCm || !age || !gender || !neckCm || !waistCm) {
            throw new HttpException(400, "Tüm gerekli değerler girilmelidir");
        }

        if (weightKg <= 0 || heightCm <= 0 || age <= 0 || neckCm <= 0 || waistCm <= 0) {
            throw new HttpException(400, "Tüm değerler pozitif olmalıdır");
        }

        let bodyFatPercent = 0;

        if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
            // Erkekler için Navy Method
            bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
        } else {
            // Kadınlar için Navy Method (kalça ölçüsü gerekli)
            if (!hipCm || hipCm <= 0) {
                throw new HttpException(400, "Kadınlar için kalça ölçüsü gereklidir");
            }
            bodyFatPercent = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
        }

        // Kategori belirleme
        let category = "";
        if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
            if (bodyFatPercent < 6) {
                category = "Çok Düşük (Atletik)";
            } else if (bodyFatPercent < 14) {
                category = "Düşük (Sporcu)";
            } else if (bodyFatPercent < 18) {
                category = "Normal (Sağlıklı)";
            } else if (bodyFatPercent < 25) {
                category = "Yüksek";
            } else {
                category = "Çok Yüksek (Obez)";
            }
        } else {
            if (bodyFatPercent < 16) {
                category = "Çok Düşük (Atletik)";
            } else if (bodyFatPercent < 20) {
                category = "Düşük (Sporcu)";
            } else if (bodyFatPercent < 25) {
                category = "Normal (Sağlıklı)";
            } else if (bodyFatPercent < 32) {
                category = "Yüksek";
            } else {
                category = "Çok Yüksek (Obez)";
            }
        }

        return {
            bodyFatPercent: Math.round(bodyFatPercent * 10) / 10,
            category,
            method: 'Navy Method',
            unit: '%'
        };
    }

    /**
     * Kapsamlı Hesaplama - Tüm değerleri bir arada
     */
    calculateAll(params) {
        const {
            weightKg,
            heightCm,
            age,
            gender,
            activityLevel = 'moderate',
            proteinPercent = 30,
            carbPercent = 40,
            fatPercent = 30,
            neckCm = null,
            waistCm = null,
            hipCm = null
        } = params;

        const results = {};

        // BMI
        if (weightKg && heightCm) {
            results.bmi = this.calculateBMI(weightKg, heightCm);
        }

        // BMR
        if (weightKg && heightCm && age && gender) {
            results.bmr = this.calculateBMR(weightKg, heightCm, age, gender, 'mifflin');
            results.bmrHarris = this.calculateBMR(weightKg, heightCm, age, gender, 'harris');
        }

        // TDEE
        if (results.bmr && activityLevel) {
            results.tdee = this.calculateTDEE(results.bmr.bmr, activityLevel);
        }

        // Makro Besin
        if (results.tdee) {
            results.macros = this.calculateMacros(
                results.tdee.tdee,
                proteinPercent,
                carbPercent,
                fatPercent
            );
        }

        // İdeal Kilo
        if (heightCm && gender) {
            results.idealWeight = this.calculateIdealWeight(heightCm, gender, 'robinson');
        }

        // Vücut Yağ Yüzdesi
        if (weightKg && heightCm && age && gender && neckCm && waistCm) {
            try {
                results.bodyFat = this.calculateBodyFatPercent(
                    weightKg,
                    heightCm,
                    age,
                    gender,
                    neckCm,
                    waistCm,
                    hipCm
                );
            } catch (error) {
                // Kalça ölçüsü eksikse atla
            }
        }

        return results;
    }

    /**
     * Su İhtiyacı Hesaplama
     * Kilo, aktivite düzeyi ve mevsimsel faktörlere göre günlük su ihtiyacı
     */
    calculateWaterIntake(weightKg, activityLevel, season = 'normal') {
        if (!weightKg || weightKg <= 0) {
            throw new HttpException(400, "Kilo değeri pozitif olmalıdır");
        }

        // Temel su ihtiyacı: 35 ml/kg (genel kural)
        let baseWaterMl = weightKg * 35;

        // Aktivite düzeyine göre ek su ihtiyacı
        const activityMultipliers = {
            'sedentary': 1.0,
            'light': 1.1,
            'moderate': 1.2,
            'active': 1.3,
            'very_active': 1.5
        };

        const activityMultiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.0;
        baseWaterMl = baseWaterMl * activityMultiplier;

        // Mevsimsel faktörler
        const seasonMultipliers = {
            'yaz': 1.2,      // Yaz aylarında %20 daha fazla
            'kış': 0.9,      // Kış aylarında %10 daha az
            'ilkbahar': 1.0,
            'sonbahar': 1.0,
            'normal': 1.0
        };

        const seasonMultiplier = seasonMultipliers[season.toLowerCase()] || 1.0;
        const totalWaterMl = baseWaterMl * seasonMultiplier;

        // Litre cinsinden
        const totalWaterL = totalWaterMl / 1000;

        // Bardak cinsinden (ortalama 250ml bardak)
        const glasses = Math.round(totalWaterMl / 250);

        let recommendation = "";
        if (totalWaterL < 2) {
            recommendation = "Su tüketiminizi artırmaya çalışın. Günlük en az 2 litre su içmeyi hedefleyin.";
        } else if (totalWaterL < 3) {
            recommendation = "Su tüketiminiz normal aralıkta. Bu miktarı korumaya devam edin.";
        } else {
            recommendation = "Yeterli su tüketiyorsunuz. Düzenli su içmeye devam edin.";
        }

        return {
            waterIntakeMl: Math.round(totalWaterMl),
            waterIntakeL: Math.round(totalWaterL * 10) / 10,
            glasses: glasses,
            activityLevel: activityLevel,
            season: season,
            recommendation: recommendation,
            unit: 'L/gün'
        };
    }

    /**
     * Protein İhtiyacı Hesaplama
     * Kilo, aktivite düzeyi ve hedefe göre günlük protein ihtiyacı
     */
    calculateProteinNeeds(weightKg, activityLevel, goal = 'maintenance') {
        if (!weightKg || weightKg <= 0) {
            throw new HttpException(400, "Kilo değeri pozitif olmalıdır");
        }

        // Temel protein ihtiyacı (gram/kg)
        let proteinPerKg = 0.8; // Minimum sağlıklı seviye

        // Aktivite düzeyine göre protein ihtiyacı
        const activityProteinMultipliers = {
            'sedentary': 0.8,      // Hareketsiz: 0.8g/kg
            'light': 1.0,          // Hafif aktif: 1.0g/kg
            'moderate': 1.2,       // Orta aktif: 1.2g/kg
            'active': 1.4,         // Çok aktif: 1.4g/kg
            'very_active': 1.6     // Aşırı aktif: 1.6g/kg
        };

        proteinPerKg = activityProteinMultipliers[activityLevel.toLowerCase()] || 0.8;

        // Hedefe göre ayarlama
        const goalMultipliers = {
            'maintenance': 1.0,        // Kilo koruma
            'weight_loss': 1.2,        // Kilo verme (kas koruma için daha fazla protein)
            'muscle_gain': 1.6,        // Kas kazanma
            'athletic': 1.8            // Atletik performans
        };

        const goalMultiplier = goalMultipliers[goal.toLowerCase()] || 1.0;
        proteinPerKg = proteinPerKg * goalMultiplier;

        // Toplam protein ihtiyacı
        const totalProteinGrams = weightKg * proteinPerKg;

        // Kalori cinsinden (1g protein = 4 kcal)
        const proteinCalories = totalProteinGrams * 4;

        // Örnek gıda eşdeğerleri
        const chickenBreast = Math.round(totalProteinGrams / 31); // 100g tavuk göğsü = 31g protein
        const eggs = Math.round(totalProteinGrams / 6); // 1 yumurta = 6g protein

        let recommendation = "";
        if (proteinPerKg < 1.0) {
            recommendation = "Protein alımınızı artırmayı düşünün. Kas sağlığı ve metabolizma için yeterli protein önemlidir.";
        } else if (proteinPerKg < 1.4) {
            recommendation = "Protein alımınız normal seviyede. Aktivite seviyenize göre yeterli.";
        } else {
            recommendation = "Yüksek protein alımı hedefliyorsunuz. Bu, kas gelişimi ve tokluk için idealdir.";
        }

        return {
            proteinGrams: Math.round(totalProteinGrams * 10) / 10,
            proteinPerKg: Math.round(proteinPerKg * 10) / 10,
            proteinCalories: Math.round(proteinCalories),
            activityLevel: activityLevel,
            goal: goal,
            examples: {
                chickenBreast100g: chickenBreast,
                eggs: eggs
            },
            recommendation: recommendation,
            unit: 'g/gün'
        };
    }

    /**
     * Kalori Açığı/Fazlası Hesaplama
     * Mevcut kilodan hedef kiloya ulaşmak için gerekli kalori açığı veya fazlası
     */
    calculateCalorieDeficitSurplus(currentWeightKg, targetWeightKg, durationWeeks, activityLevel = 'moderate') {
        if (!currentWeightKg || !targetWeightKg || !durationWeeks) {
            throw new HttpException(400, "Mevcut kilo, hedef kilo ve süre gereklidir");
        }

        if (currentWeightKg <= 0 || targetWeightKg <= 0 || durationWeeks <= 0) {
            throw new HttpException(400, "Tüm değerler pozitif olmalıdır");
        }

        // Kilo farkı
        const weightDifferenceKg = targetWeightKg - currentWeightKg;

        // Toplam kalori açığı/fazlası (1 kg = 7700 kcal)
        const totalCalorieDifference = weightDifferenceKg * 7700;

        // Haftalık kalori açığı/fazlası
        const weeklyCalorieDifference = totalCalorieDifference / durationWeeks;

        // Günlük kalori açığı/fazlası
        const dailyCalorieDifference = weeklyCalorieDifference / 7;

        // Güvenli aralık kontrolü
        let isSafe = true;
        let safetyMessage = "";
        
        if (Math.abs(dailyCalorieDifference) > 1000) {
            isSafe = false;
            safetyMessage = "Günlük 1000 kcal'den fazla açık/fazla önerilmez. Süreyi uzatmayı veya hedefi gözden geçirmeyi düşünün.";
        } else if (Math.abs(dailyCalorieDifference) > 500) {
            safetyMessage = "Orta seviye bir açık/fazla. Düzenli takip önemlidir.";
        } else {
            safetyMessage = "Güvenli ve sürdürülebilir bir açık/fazla. Bu hızla ilerleyebilirsiniz.";
        }

        // Aktivite seviyesine göre TDEE tahmini (ortalama değerler kullanarak)
        const avgBMR = (currentWeightKg + targetWeightKg) / 2 * 22; // Basit tahmin
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.55;
        const estimatedTDEE = Math.round(avgBMR * multiplier);

        // Önerilen günlük kalori
        const recommendedDailyCalories = Math.round(estimatedTDEE + dailyCalorieDifference);

        // Haftalık kilo değişimi
        const weeklyWeightChange = Math.round((dailyCalorieDifference / 7700) * 7 * 10) / 10;

        let type = "";
        let description = "";
        if (dailyCalorieDifference > 0) {
            type = "Kalori Fazlası";
            description = "Kilo almak için günlük kalori fazlası";
        } else if (dailyCalorieDifference < 0) {
            type = "Kalori Açığı";
            description = "Kilo vermek için günlük kalori açığı";
        } else {
            type = "Denge";
            description = "Kilo koruma için kalori dengesi";
        }

        return {
            type: type,
            description: description,
            dailyCalorieDifference: Math.round(dailyCalorieDifference),
            weeklyCalorieDifference: Math.round(weeklyCalorieDifference),
            totalCalorieDifference: Math.round(totalCalorieDifference),
            recommendedDailyCalories: recommendedDailyCalories,
            estimatedTDEE: estimatedTDEE,
            weeklyWeightChange: weeklyWeightChange,
            weightDifferenceKg: Math.round(weightDifferenceKg * 10) / 10,
            durationWeeks: durationWeeks,
            activityLevel: activityLevel,
            isSafe: isSafe,
            safetyMessage: safetyMessage,
            unit: 'kcal/gün'
        };
    }

    /**
     * Waist-to-Hip Ratio (WHR) - Bel-Kalça Oranı
     * Kardiyovasküler risk değerlendirmesi için kullanılır
     * WHR = Bel Çevresi (cm) / Kalça Çevresi (cm)
     */
    calculateWHR(waistCm, hipCm, gender) {
        if (!waistCm || !hipCm || waistCm <= 0 || hipCm <= 0) {
            throw new HttpException(400, "Bel ve kalça çevresi pozitif olmalıdır");
        }

        const whr = waistCm / hipCm;

        let riskCategory = "";
        let riskLevel = "";
        let description = "";

        if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
            if (whr < 0.85) {
                riskCategory = "Düşük Risk";
                riskLevel = "low";
                description = "Kardiyovasküler risk düşük. Sağlıklı vücut yağ dağılımı.";
            } else if (whr < 0.90) {
                riskCategory = "Orta Risk";
                riskLevel = "medium";
                description = "Orta seviye risk. Bel çevresini azaltmayı hedefleyin.";
            } else if (whr < 0.95) {
                riskCategory = "Yüksek Risk";
                riskLevel = "high";
                description = "Yüksek kardiyovasküler risk. Mutlaka bir uzmana danışın.";
            } else {
                riskCategory = "Çok Yüksek Risk";
                riskLevel = "very_high";
                description = "Çok yüksek risk. Acil müdahale gereklidir.";
            }
        } else {
            if (whr < 0.75) {
                riskCategory = "Düşük Risk";
                riskLevel = "low";
                description = "Kardiyovasküler risk düşük. Sağlıklı vücut yağ dağılımı.";
            } else if (whr < 0.85) {
                riskCategory = "Orta Risk";
                riskLevel = "medium";
                description = "Orta seviye risk. Bel çevresini azaltmayı hedefleyin.";
            } else if (whr < 0.90) {
                riskCategory = "Yüksek Risk";
                riskLevel = "high";
                description = "Yüksek kardiyovasküler risk. Mutlaka bir uzmana danışın.";
            } else {
                riskCategory = "Çok Yüksek Risk";
                riskLevel = "very_high";
                description = "Çok yüksek risk. Acil müdahale gereklidir.";
            }
        }

        return {
            whr: Math.round(whr * 100) / 100,
            waistCm: waistCm,
            hipCm: hipCm,
            riskCategory,
            riskLevel,
            description,
            unit: 'oran'
        };
    }

    /**
     * Waist-to-Height Ratio (WHtR) - Bel-Boy Oranı
     * BMI'den daha iyi bir sağlık göstergesi
     * WHtR = Bel Çevresi (cm) / Boy (cm)
     */
    calculateWHtR(waistCm, heightCm) {
        if (!waistCm || !heightCm || waistCm <= 0 || heightCm <= 0) {
            throw new HttpException(400, "Bel çevresi ve boy pozitif olmalıdır");
        }

        const whtr = waistCm / heightCm;

        let category = "";
        let riskLevel = "";
        let description = "";

        if (whtr < 0.40) {
            category = "Çok Düşük";
            riskLevel = "very_low";
            description = "Çok düşük risk. İdeal vücut kompozisyonu.";
        } else if (whtr < 0.50) {
            category = "Düşük Risk";
            riskLevel = "low";
            description = "Düşük risk. Sağlıklı bel çevresi.";
        } else if (whtr < 0.57) {
            category = "Orta Risk";
            riskLevel = "medium";
            description = "Orta seviye risk. Bel çevresini azaltmayı hedefleyin.";
        } else if (whtr < 0.63) {
            category = "Yüksek Risk";
            riskLevel = "high";
            description = "Yüksek risk. Mutlaka bir uzmana danışın.";
        } else {
            category = "Çok Yüksek Risk";
            riskLevel = "very_high";
            description = "Çok yüksek risk. Acil müdahale gereklidir.";
        }

        return {
            whtr: Math.round(whtr * 1000) / 1000,
            waistCm: waistCm,
            heightCm: heightCm,
            category,
            riskLevel,
            description,
            unit: 'oran'
        };
    }

    /**
     * Lean Body Mass (LBM) - Yağsız Vücut Kütlesi
     * LBM = Toplam Ağırlık - Vücut Yağ Kütlesi
     * Vücut yağ yüzdesi bilinmiyorsa Boer formülü kullanılır
     */
    calculateLBM(weightKg, heightCm, age, gender, bodyFatPercent = null) {
        if (!weightKg || !heightCm || !age || !gender || weightKg <= 0 || heightCm <= 0 || age <= 0) {
            throw new HttpException(400, "Tüm değerler pozitif olmalıdır");
        }

        let lbm = 0;
        let method = "";

        if (bodyFatPercent !== null && bodyFatPercent > 0 && bodyFatPercent < 100) {
            // Vücut yağ yüzdesi biliniyorsa direkt hesapla
            const bodyFatMass = (weightKg * bodyFatPercent) / 100;
            lbm = weightKg - bodyFatMass;
            method = "Vücut Yağ Yüzdesi";
        } else {
            // Boer formülü (1984) - Vücut yağ yüzdesi bilinmiyorsa
            if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                lbm = (0.407 * weightKg) + (0.267 * heightCm) - 19.2;
            } else {
                lbm = (0.252 * weightKg) + (0.473 * heightCm) - 48.3;
            }
            method = "Boer Formülü (1984)";
        }

        // Vücut yağ kütlesi
        const bodyFatMass = weightKg - lbm;
        const bodyFatPercentCalculated = (bodyFatMass / weightKg) * 100;

        return {
            lbm: Math.round(lbm * 10) / 10,
            bodyFatMass: Math.round(bodyFatMass * 10) / 10,
            bodyFatPercent: bodyFatPercent !== null ? bodyFatPercent : Math.round(bodyFatPercentCalculated * 10) / 10,
            totalWeight: weightKg,
            method,
            unit: 'kg'
        };
    }

    /**
     * Fat-Free Mass Index (FFMI) - Yağsız Kütle İndeksi
     * Sporcular ve kas gelişimi için önemli
     * FFMI = (LBM / 2.2) / ((heightCm / 100)^2)
     * Normalize FFMI = FFMI + 6.1 × (1.8 - heightCm / 100)
     */
    calculateFFMI(weightKg, heightCm, age, gender, bodyFatPercent = null) {
        if (!weightKg || !heightCm || !age || !gender || weightKg <= 0 || heightCm <= 0 || age <= 0) {
            throw new HttpException(400, "Tüm değerler pozitif olmalıdır");
        }

        // Önce LBM hesapla
        const lbmData = this.calculateLBM(weightKg, heightCm, age, gender, bodyFatPercent);
        const lbm = lbmData.lbm;

        const heightM = heightCm / 100;
        const ffmi = (lbm / 2.2) / (heightM * heightM);
        
        // Normalize FFMI (1.8m referans boy için)
        const normalizedFFMI = ffmi + (6.1 * (1.8 - heightM));

        let category = "";
        let description = "";

        if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
            if (normalizedFFMI < 16) {
                category = "Çok Düşük";
                description = "Kas kütlesi çok düşük. Protein alımını ve direnç antrenmanını artırın.";
            } else if (normalizedFFMI < 18) {
                category = "Düşük";
                description = "Kas kütlesi düşük. Düzenli antrenman ve yeterli protein önemli.";
            } else if (normalizedFFMI < 20) {
                category = "Normal";
                description = "Normal kas kütlesi. Mevcut programınızı sürdürebilirsiniz.";
            } else if (normalizedFFMI < 22) {
                category = "İyi";
                description = "İyi kas kütlesi. Sporcu seviyesinde.";
            } else if (normalizedFFMI < 25) {
                category = "Çok İyi";
                description = "Çok iyi kas kütlesi. İleri seviye sporcu.";
            } else {
                category = "Mükemmel";
                description = "Mükemmel kas kütlesi. Profesyonel sporcu seviyesi.";
            }
        } else {
            if (normalizedFFMI < 14) {
                category = "Çok Düşük";
                description = "Kas kütlesi çok düşük. Protein alımını ve direnç antrenmanını artırın.";
            } else if (normalizedFFMI < 16) {
                category = "Düşük";
                description = "Kas kütlesi düşük. Düzenli antrenman ve yeterli protein önemli.";
            } else if (normalizedFFMI < 18) {
                category = "Normal";
                description = "Normal kas kütlesi. Mevcut programınızı sürdürebilirsiniz.";
            } else if (normalizedFFMI < 20) {
                category = "İyi";
                description = "İyi kas kütlesi. Sporcu seviyesinde.";
            } else if (normalizedFFMI < 22) {
                category = "Çok İyi";
                description = "Çok iyi kas kütlesi. İleri seviye sporcu.";
            } else {
                category = "Mükemmel";
                description = "Mükemmel kas kütlesi. Profesyonel sporcu seviyesi.";
            }
        }

        return {
            ffmi: Math.round(ffmi * 10) / 10,
            normalizedFFMI: Math.round(normalizedFFMI * 10) / 10,
            lbm: lbm,
            category,
            description,
            unit: 'indeks'
        };
    }

    /**
     * Metabolic Age - Metabolik Yaş
     * BMR'yi referans değerlerle karşılaştırarak metabolik yaşı hesaplar
     */
    calculateMetabolicAge(weightKg, heightCm, age, gender, bmr, formula = 'mifflin') {
        if (!weightKg || !heightCm || !age || !gender || !bmr || weightKg <= 0 || heightCm <= 0 || age <= 0 || bmr <= 0) {
            throw new HttpException(400, "Tüm değerler pozitif olmalıdır");
        }

        // Referans BMR hesapla (aynı kilo, boy, cinsiyet için farklı yaşlarda)
        let referenceBMR = 0;
        let metabolicAge = age;
        const ageRange = 80; // 0-80 yaş arası kontrol et

        for (let testAge = 0; testAge <= ageRange; testAge++) {
            if (formula === 'mifflin') {
                if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                    referenceBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * testAge) + 5;
                } else {
                    referenceBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * testAge) - 161;
                }
            } else {
                if (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
                    referenceBMR = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * testAge);
                } else {
                    referenceBMR = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * testAge);
                }
            }

            // Gerçek BMR'ye en yakın referans BMR'yi bul
            if (Math.abs(bmr - referenceBMR) < Math.abs(bmr - ((10 * weightKg) + (6.25 * heightCm) - (5 * metabolicAge) + (gender.toLowerCase() === 'erkek' || gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm' ? 5 : -161)))) {
                metabolicAge = testAge;
            }
        }

        const ageDifference = metabolicAge - age;
        let category = "";
        let description = "";

        if (ageDifference < -5) {
            category = "Çok Genç";
            description = "Metabolik yaşınız kronolojik yaşınızdan çok daha genç. Mükemmel metabolik sağlık!";
        } else if (ageDifference < 0) {
            category = "Genç";
            description = "Metabolik yaşınız kronolojik yaşınızdan genç. İyi metabolik sağlık.";
        } else if (ageDifference === 0) {
            category = "Normal";
            description = "Metabolik yaşınız kronolojik yaşınıza eşit. Normal metabolik sağlık.";
        } else if (ageDifference < 5) {
            category = "Yaşlı";
            description = "Metabolik yaşınız kronolojik yaşınızdan biraz yüksek. Metabolizmanızı hızlandırmayı hedefleyin.";
        } else {
            category = "Çok Yaşlı";
            description = "Metabolik yaşınız kronolojik yaşınızdan çok yüksek. Mutlaka bir uzmana danışın.";
        }

        return {
            metabolicAge: Math.round(metabolicAge),
            chronologicalAge: age,
            ageDifference: Math.round(ageDifference),
            category,
            description,
            bmr: bmr,
            unit: 'yaş'
        };
    }

    /**
     * Body Surface Area (BSA) - Vücut Yüzey Alanı
     * Tıbbi hesaplamalar ve ilaç dozajı için kullanılır
     * Du Bois formülü: BSA = 0.007184 × weight^0.425 × height^0.725
     * Mosteller formülü: BSA = sqrt((height × weight) / 3600)
     */
    calculateBSA(weightKg, heightCm, formula = 'dubois') {
        if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
            throw new HttpException(400, "Kilo ve boy pozitif olmalıdır");
        }

        let bsa = 0;
        let formulaName = "";

        if (formula === 'dubois') {
            // Du Bois formülü (1916) - En yaygın kullanılan
            bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
            formulaName = "Du Bois (1916)";
        } else if (formula === 'mosteller') {
            // Mosteller formülü (1987) - Daha basit
            bsa = Math.sqrt((heightCm * weightKg) / 3600);
            formulaName = "Mosteller (1987)";
        } else if (formula === 'haycock') {
            // Haycock formülü (1978)
            bsa = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964);
            formulaName = "Haycock (1978)";
        } else if (formula === 'gehan') {
            // Gehan & George formülü (1970)
            bsa = 0.0235 * Math.pow(weightKg, 0.51456) * Math.pow(heightCm, 0.42246);
            formulaName = "Gehan & George (1970)";
        } else {
            throw new HttpException(400, "Geçersiz formül. 'dubois', 'mosteller', 'haycock', 'gehan' olmalıdır");
        }

        return {
            bsa: Math.round(bsa * 10000) / 10000,
            formula: formulaName,
            weightKg: weightKg,
            heightCm: heightCm,
            unit: 'm²'
        };
    }
}

