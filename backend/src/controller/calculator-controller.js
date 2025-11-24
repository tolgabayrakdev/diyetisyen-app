import CalculatorService from "../service/calculator-service.js";

export default class CalculatorController {
    constructor() {
        this.calculatorService = new CalculatorService();
    }

    async calculateBMI(req, res, next) {
        try {
            const { weightKg, heightCm } = req.body;

            if (!weightKg || !heightCm) {
                return res.status(400).json({
                    success: false,
                    message: "Kilo ve boy değerleri gereklidir"
                });
            }

            const result = this.calculatorService.calculateBMI(
                parseFloat(weightKg),
                parseFloat(heightCm)
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateBMR(req, res, next) {
        try {
            const { weightKg, heightCm, age, gender, formula } = req.body;

            if (!weightKg || !heightCm || !age || !gender) {
                return res.status(400).json({
                    success: false,
                    message: "Kilo, boy, yaş ve cinsiyet değerleri gereklidir"
                });
            }

            const result = this.calculatorService.calculateBMR(
                parseFloat(weightKg),
                parseFloat(heightCm),
                parseInt(age),
                gender,
                formula || 'mifflin'
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateTDEE(req, res, next) {
        try {
            const { bmr, activityLevel } = req.body;

            if (!bmr || !activityLevel) {
                return res.status(400).json({
                    success: false,
                    message: "BMR ve aktivite seviyesi gereklidir"
                });
            }

            const result = this.calculatorService.calculateTDEE(
                parseFloat(bmr),
                activityLevel
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateMacros(req, res, next) {
        try {
            const { totalCalories, proteinPercent, carbPercent, fatPercent } = req.body;

            if (!totalCalories) {
                return res.status(400).json({
                    success: false,
                    message: "Toplam kalori gereklidir"
                });
            }

            const result = this.calculatorService.calculateMacros(
                parseFloat(totalCalories),
                proteinPercent ? parseFloat(proteinPercent) : 30,
                carbPercent ? parseFloat(carbPercent) : 40,
                fatPercent ? parseFloat(fatPercent) : 30
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateIdealWeight(req, res, next) {
        try {
            const { heightCm, gender, formula } = req.body;

            if (!heightCm || !gender) {
                return res.status(400).json({
                    success: false,
                    message: "Boy ve cinsiyet değerleri gereklidir"
                });
            }

            const result = this.calculatorService.calculateIdealWeight(
                parseFloat(heightCm),
                gender,
                formula || 'robinson'
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateBodyFat(req, res, next) {
        try {
            const { weightKg, heightCm, age, gender, neckCm, waistCm, hipCm } = req.body;

            if (!weightKg || !heightCm || !age || !gender || !neckCm || !waistCm) {
                return res.status(400).json({
                    success: false,
                    message: "Tüm gerekli değerler girilmelidir"
                });
            }

            const result = this.calculatorService.calculateBodyFatPercent(
                parseFloat(weightKg),
                parseFloat(heightCm),
                parseInt(age),
                gender,
                parseFloat(neckCm),
                parseFloat(waistCm),
                hipCm ? parseFloat(hipCm) : null
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateAll(req, res, next) {
        try {
            const params = req.body;

            const result = this.calculatorService.calculateAll(params);

            res.status(200).json({
                success: true,
                results: result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateWaterIntake(req, res, next) {
        try {
            const { weightKg, activityLevel, season } = req.body;

            if (!weightKg || !activityLevel) {
                return res.status(400).json({
                    success: false,
                    message: "Kilo ve aktivite seviyesi gereklidir"
                });
            }

            const result = this.calculatorService.calculateWaterIntake(
                parseFloat(weightKg),
                activityLevel,
                season || 'normal'
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateProteinNeeds(req, res, next) {
        try {
            const { weightKg, activityLevel, goal } = req.body;

            if (!weightKg || !activityLevel) {
                return res.status(400).json({
                    success: false,
                    message: "Kilo ve aktivite seviyesi gereklidir"
                });
            }

            const result = this.calculatorService.calculateProteinNeeds(
                parseFloat(weightKg),
                activityLevel,
                goal || 'maintenance'
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async calculateCalorieDeficitSurplus(req, res, next) {
        try {
            const { currentWeightKg, targetWeightKg, durationWeeks, activityLevel } = req.body;

            if (!currentWeightKg || !targetWeightKg || !durationWeeks) {
                return res.status(400).json({
                    success: false,
                    message: "Mevcut kilo, hedef kilo ve süre (hafta) gereklidir"
                });
            }

            const result = this.calculatorService.calculateCalorieDeficitSurplus(
                parseFloat(currentWeightKg),
                parseFloat(targetWeightKg),
                parseInt(durationWeeks),
                activityLevel || 'moderate'
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}

