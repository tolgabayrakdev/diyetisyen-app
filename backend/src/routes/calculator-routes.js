import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import CalculatorController from "../controller/calculator-controller.js";

const router = express.Router();
const calculatorController = new CalculatorController();

// BMI hesaplama
router.post("/calculator/bmi", verifyToken, calculatorController.calculateBMI.bind(calculatorController));

// BMR hesaplama
router.post("/calculator/bmr", verifyToken, calculatorController.calculateBMR.bind(calculatorController));

// TDEE hesaplama
router.post("/calculator/tdee", verifyToken, calculatorController.calculateTDEE.bind(calculatorController));

// Makro besin hesaplama
router.post("/calculator/macros", verifyToken, calculatorController.calculateMacros.bind(calculatorController));

// İdeal kilo hesaplama
router.post("/calculator/ideal-weight", verifyToken, calculatorController.calculateIdealWeight.bind(calculatorController));

// Vücut yağ yüzdesi hesaplama
router.post("/calculator/body-fat", verifyToken, calculatorController.calculateBodyFat.bind(calculatorController));

// Tüm hesaplamaları bir arada
router.post("/calculator/all", verifyToken, calculatorController.calculateAll.bind(calculatorController));

// Su ihtiyacı hesaplama
router.post("/calculator/water-intake", verifyToken, calculatorController.calculateWaterIntake.bind(calculatorController));

// Protein ihtiyacı hesaplama
router.post("/calculator/protein-needs", verifyToken, calculatorController.calculateProteinNeeds.bind(calculatorController));

// Kalori açığı/fazlası hesaplama
router.post("/calculator/calorie-deficit-surplus", verifyToken, calculatorController.calculateCalorieDeficitSurplus.bind(calculatorController));

export default router;

