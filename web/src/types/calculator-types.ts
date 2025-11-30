export interface BMIResult {
    bmi: number;
    category: string;
    description: string;
}

export interface BMRResult {
    bmr: number;
    formula: string;
    unit: string;
}

export interface TDEEResult {
    tdee: number;
    bmr: number;
    activityLevel: string;
    multiplier: number;
    unit: string;
}

export interface MacrosResult {
    totalCalories: number;
    protein: { percent: number; calories: number; grams: number };
    carbohydrates: { percent: number; calories: number; grams: number };
    fat: { percent: number; calories: number; grams: number };
}

export interface IdealWeightResult {
    idealWeightKg: number;
    formula: string;
    unit: string;
}

export interface BodyFatResult {
    bodyFatPercent: number;
    category: string;
    method: string;
    unit: string;
}

export interface WaterIntakeResult {
    waterIntakeMl: number;
    waterIntakeL: number;
    glasses: number;
    activityLevel: string;
    season: string;
    recommendation: string;
    unit: string;
}

export interface ProteinNeedsResult {
    proteinGrams: number;
    proteinPerKg: number;
    proteinCalories: number;
    activityLevel: string;
    goal: string;
    examples: {
        chickenBreast100g: number;
        eggs: number;
    };
    recommendation: string;
    unit: string;
}

export interface CalorieDeficitSurplusResult {
    type: string;
    description: string;
    dailyCalorieDifference: number;
    weeklyCalorieDifference: number;
    totalCalorieDifference: number;
    recommendedDailyCalories: number;
    estimatedTDEE: number;
    weeklyWeightChange: number;
    weightDifferenceKg: number;
    durationWeeks: number;
    activityLevel: string;
    isSafe: boolean;
    safetyMessage: string;
    unit: string;
}

export interface WHRResult {
    whr: number;
    waistCm: number;
    hipCm: number;
    riskCategory: string;
    riskLevel: string;
    description: string;
    unit: string;
}

export interface WHtRResult {
    whtr: number;
    waistCm: number;
    heightCm: number;
    category: string;
    riskLevel: string;
    description: string;
    unit: string;
}

export interface LBMResult {
    lbm: number;
    bodyFatMass: number;
    bodyFatPercent: number;
    totalWeight: number;
    method: string;
    unit: string;
}

export interface FFMIResult {
    ffmi: number;
    normalizedFFMI: number;
    lbm: number;
    category: string;
    description: string;
    unit: string;
}

export interface MetabolicAgeResult {
    metabolicAge: number;
    chronologicalAge: number;
    ageDifference: number;
    category: string;
    description: string;
    bmr: number;
    unit: string;
}

export interface BSAResult {
    bsa: number;
    formula: string;
    weightKg: number;
    heightCm: number;
    unit: string;
}

export type CalculatorType = 
    | "bmi" 
    | "bmr" 
    | "tdee" 
    | "macros" 
    | "ideal" 
    | "bodyfat" 
    | "water" 
    | "protein" 
    | "caloriedeficit" 
    | "whr" 
    | "whtr" 
    | "lbm" 
    | "ffmi" 
    | "metabolicage" 
    | "bsa" 
    | null;

export interface CalculatorFormData {
    weightKg: string;
    heightCm: string;
    age: string;
    gender: string;
    activityLevel: string;
    proteinPercent: string;
    carbPercent: string;
    fatPercent: string;
    neckCm: string;
    waistCm: string;
    hipCm: string;
    bmrFormula: string;
    idealWeightFormula: string;
    totalCalories: string;
    season: string;
    proteinGoal: string;
    currentWeightKg: string;
    targetWeightKg: string;
    durationWeeks: string;
    bodyFatPercent: string;
    bsaFormula: string;
}

