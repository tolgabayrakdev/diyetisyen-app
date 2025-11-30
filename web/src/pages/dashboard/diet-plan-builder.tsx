import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
    ArrowLeft, 
    ArrowRight, 
    Check, 
    Clock,
    Utensils,
    Target,
    Download,
    FileText,
    Plus,
    X,
    Eye,
    Copy,
    Trash2,
    User,
    Activity,
    Flame,
    Calculator,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const activityLevels = [
    { id: "sedentary", name: "Hareketsiz", description: "Masa başı iş, egzersiz yok", multiplier: 1.2 },
    { id: "light", name: "Hafif Aktif", description: "Hafif egzersiz, haftada 1-3 gün", multiplier: 1.375 },
    { id: "moderate", name: "Orta Aktif", description: "Orta egzersiz, haftada 3-5 gün", multiplier: 1.55 },
    { id: "active", name: "Aktif", description: "Yoğun egzersiz, haftada 6-7 gün", multiplier: 1.725 },
    { id: "very-active", name: "Çok Aktif", description: "Profesyonel sporcu seviyesi", multiplier: 1.9 },
];

interface MealFood {
    id: string;
    name: string;
    portion: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

interface MealPlan {
    id: string;
    name: string;
    time: string;
    foods: MealFood[];
    notes: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function DietPlanBuilderPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
    
    // Step 1: Parameters
    const [planInfo, setPlanInfo] = useState({
        title: "",
        duration: 4,
        startDate: new Date().toISOString().split('T')[0],
        notes: "",
    });

    const [clientInfo, setClientInfo] = useState({
        age: 30,
        gender: "female" as "male" | "female",
        weight: 70,
        height: 165,
        activityLevel: "moderate",
    });

    const [calorieSettings, setCalorieSettings] = useState({
        dailyCalories: 2000,
        useAutoCalculation: true,
        calorieDeficit: 0, // -500 for weight loss, +500 for weight gain
    });

    const [macroGrams, setMacroGrams] = useState({
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    // Step 2: Meal Plans
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

    // Calculate BMR and TDEE
    useEffect(() => {
        if (!calorieSettings.useAutoCalculation) return;

        const { age, gender, weight, height, activityLevel } = clientInfo;
        
        // Mifflin-St Jeor Equation
        let bmr: number;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        const activity = activityLevels.find(a => a.id === activityLevel);
        const tdee = bmr * (activity?.multiplier || 1.55);
        const targetCalories = Math.round(tdee + calorieSettings.calorieDeficit);
        
        setCalorieSettings(prev => ({ ...prev, dailyCalories: targetCalories }));
    }, [clientInfo, calorieSettings.useAutoCalculation, calorieSettings.calorieDeficit]);

    // Initialize meals
    useEffect(() => {
        if (mealPlans.length === 0) {
            const defaultMeals: MealPlan[] = [
                { id: generateId(), name: "Kahvaltı", time: "08:00", foods: [], notes: "" },
                { id: generateId(), name: "Ara Öğün", time: "10:30", foods: [], notes: "" },
                { id: generateId(), name: "Öğle Yemeği", time: "13:00", foods: [], notes: "" },
                { id: generateId(), name: "Ara Öğün", time: "16:00", foods: [], notes: "" },
                { id: generateId(), name: "Akşam Yemeği", time: "19:00", foods: [], notes: "" },
            ];
            setMealPlans(defaultMeals);
        }
    }, []);

    const dailyCalories = calorieSettings.dailyCalories;
    
    // Calculate percentages from grams
    const macroCalories = {
        protein: macroGrams.protein * 4,
        carbs: macroGrams.carbs * 4,
        fat: macroGrams.fat * 9,
    };
    const totalMacroCalories = macroCalories.protein + macroCalories.carbs + macroCalories.fat;
    
    const macroPercentages = totalMacroCalories > 0 ? {
        protein: Math.round((macroCalories.protein / totalMacroCalories) * 100),
        carbs: Math.round((macroCalories.carbs / totalMacroCalories) * 100),
        fat: Math.round((macroCalories.fat / totalMacroCalories) * 100),
    } : { protein: 0, carbs: 0, fat: 0 };
    
    const totalPercentage = macroPercentages.protein + macroPercentages.carbs + macroPercentages.fat;

    const [titleError, setTitleError] = useState("");

    const handleNext = () => {
        if (step === 1) {
            if (!planInfo.title || planInfo.title.trim() === "") {
                setTitleError("Plan başlığı zorunludur");
                toast.error("Lütfen plan başlığı girin");
                return;
            }
            setTitleError("");
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const addMeal = () => {
        const newMeal: MealPlan = {
            id: generateId(),
            name: `Öğün ${mealPlans.length + 1}`,
            time: "12:00",
            foods: [],
            notes: ""
        };
        setMealPlans([...mealPlans, newMeal]);
    };

    const removeMeal = (mealId: string) => {
        if (mealPlans.length <= 1) {
            toast.error("En az bir öğün olmalıdır");
            return;
        }
        setMealPlans(mealPlans.filter(m => m.id !== mealId));
    };

    const duplicateMeal = (mealId: string) => {
        const meal = mealPlans.find(m => m.id === mealId);
        if (meal) {
            const newMeal = {
                ...meal,
                id: generateId(),
                name: `${meal.name} (Kopya)`,
                foods: meal.foods.map(f => ({ ...f, id: generateId() }))
            };
            const index = mealPlans.findIndex(m => m.id === mealId);
            const newMealPlans = [...mealPlans];
            newMealPlans.splice(index + 1, 0, newMeal);
            setMealPlans(newMealPlans);
        }
    };

    const addFoodToMeal = (mealId: string) => {
        const newFood: MealFood = {
            id: generateId(),
            name: "",
            portion: "",
        };
        setMealPlans(mealPlans.map(meal => 
            meal.id === mealId 
                ? { ...meal, foods: [...meal.foods, newFood] }
                : meal
        ));
    };

    const updateFood = (mealId: string, foodId: string, updates: Partial<MealFood>) => {
        setMealPlans(mealPlans.map(meal => 
            meal.id === mealId 
                ? { 
                    ...meal, 
                    foods: meal.foods.map(food => 
                        food.id === foodId ? { ...food, ...updates } : food
                    )
                }
                : meal
        ));
    };

    const removeFood = (mealId: string, foodId: string) => {
        setMealPlans(mealPlans.map(meal => 
            meal.id === mealId 
                ? { ...meal, foods: meal.foods.filter(f => f.id !== foodId) }
                : meal
        ));
    };

    const updateMeal = (mealId: string, updates: Partial<MealPlan>) => {
        setMealPlans(mealPlans.map(meal => 
            meal.id === mealId ? { ...meal, ...updates } : meal
        ));
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Pop-up engelleyici aktif olabilir");
            return;
        }

        const endDate = new Date(planInfo.startDate);
        endDate.setDate(endDate.getDate() + (planInfo.duration * 7));

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${planInfo.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 30px;
            color: #1a1a1a;
            line-height: 1.6;
            font-size: 13px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #6366f1;
        }
        .header h1 { font-size: 26px; color: #1e1b4b; margin-bottom: 8px; font-weight: 700; }
        .header .dates { font-size: 12px; color: #6b7280; margin-top: 5px; }
        
        .meals-section h2 { 
            font-size: 18px; 
            color: #1e293b; 
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .meal {
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .meal-header {
            background: #6366f1;
            color: white;
            padding: 12px 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .meal-header .name { font-size: 15px; }
        .meal-header .time { font-size: 13px; opacity: 0.9; }
        .meal-content {
            padding: 16px;
        }
        .food-item {
            padding: 10px 0;
            border-bottom: 1px dashed #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .food-item:last-child {
            border-bottom: none;
        }
        .food-item .name {
            font-size: 14px;
            font-weight: 500;
            flex: 1;
        }
        .food-item .portion {
            font-size: 13px;
            color: #64748b;
            margin-left: 20px;
        }
        .meal-note {
            margin-top: 12px;
            padding: 10px;
            background: #fef3c7;
            border-radius: 6px;
            font-size: 12px;
            color: #92400e;
            font-style: italic;
        }
        
        .notes-section { 
            margin-top: 30px; 
            padding: 20px; 
            background: #f0fdf4; 
            border-radius: 8px; 
            border: 1px solid #bbf7d0; 
        }
        .notes-section h3 { font-size: 14px; color: #166534; margin-bottom: 10px; font-weight: 600; }
        .notes-section p { color: #166534; font-size: 13px; white-space: pre-wrap; line-height: 1.6; }
        
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e2e8f0; 
            text-align: center; 
            color: #9ca3af; 
            font-size: 11px; 
        }
        
        @media print {
            body { padding: 20px; }
            .meal { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${planInfo.title}</h1>
        <div class="dates">${new Date(planInfo.startDate).toLocaleDateString('tr-TR')} - ${endDate.toLocaleDateString('tr-TR')} (${planInfo.duration} Hafta)</div>
    </div>

    <div class="meals-section">
        <h2>📋 Günlük Beslenme Programı</h2>
        
        ${mealPlans.map((meal, mealIndex) => `
            <div class="meal">
                <div class="meal-header">
                    <span class="name">${mealIndex + 1}. ${meal.name}</span>
                    <span class="time">🕐 ${meal.time}</span>
                </div>
                <div class="meal-content">
                    ${meal.foods.length > 0 ? meal.foods.map(food => `
                        <div class="food-item">
                            <span class="name">${food.name || '-'}</span>
                            <span class="portion">${food.portion || '-'}</span>
                        </div>
                    `).join('') : `
                        <div style="color: #9ca3af; font-style: italic; padding: 10px 0;">Besin eklenmemiş</div>
                    `}
                    ${meal.notes ? `<div class="meal-note">📝 ${meal.notes}</div>` : ''}
                </div>
            </div>
        `).join('')}
    </div>

    ${planInfo.notes ? `
        <div class="notes-section">
            <h3>📋 Önemli Notlar ve Öneriler</h3>
            <p>${planInfo.notes}</p>
        </div>
    ` : ''}

    <div class="footer">
        Bu diyet planı DiyetKa ile oluşturulmuştur • ${new Date().toLocaleDateString('tr-TR')}
    </div>
</body>
</html>`;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Diyet Planı Oluştur</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Detaylı parametrelerle plan oluşturun ve PDF olarak indirin
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                        { num: 1, label: "Parametreler", icon: Target },
                        { num: 2, label: "Öğünler", icon: Utensils },
                        { num: 3, label: "PDF İndir", icon: Download }
                    ].map((s) => (
                        <div key={s.num} className="flex items-center gap-2 shrink-0">
                            <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                                step >= s.num 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {step > s.num ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                            </div>
                            <span className={cn(
                                "text-sm font-medium",
                                step >= s.num ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {s.label}
                            </span>
                            {s.num < 3 && <div className={cn(
                                "w-8 h-0.5 mx-1",
                                step > s.num ? "bg-primary" : "bg-muted"
                            )} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Parameters */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Plan Info */}
                        <div className="border rounded-xl p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Plan Bilgileri
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Plan Başlığı *</Label>
                                    <Input
                                        value={planInfo.title}
                                        onChange={(e) => {
                                            setPlanInfo({ ...planInfo, title: e.target.value });
                                            if (titleError && e.target.value.trim() !== "") {
                                                setTitleError("");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!planInfo.title || planInfo.title.trim() === "") {
                                                setTitleError("Plan başlığı zorunludur");
                                            }
                                        }}
                                        placeholder="Örn: 8 Haftalık Kilo Verme Programı"
                                        className={titleError ? "border-destructive" : ""}
                                    />
                                    {titleError && (
                                        <p className="text-sm text-destructive">{titleError}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Başlangıç Tarihi</Label>
                                        <Input
                                            type="date"
                                            value={planInfo.startDate}
                                            onChange={(e) => setPlanInfo({ ...planInfo, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Süre (Hafta)</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={52}
                                            value={planInfo.duration}
                                            onChange={(e) => setPlanInfo({ ...planInfo, duration: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="border rounded-xl p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Danışan Bilgileri
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="text-xs text-muted-foreground">(Kalori hesaplaması için)</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Mifflin-St Jeor formülü ile BMR ve TDEE hesaplanır</p>
                                    </TooltipContent>
                                </Tooltip>
                            </h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div className="space-y-2">
                                    <Label>Yaş</Label>
                                    <Input
                                        type="number"
                                        value={clientInfo.age}
                                        onChange={(e) => setClientInfo({ ...clientInfo, age: parseInt(e.target.value) || 30 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cinsiyet</Label>
                                    <select
                                        value={clientInfo.gender}
                                        onChange={(e) => setClientInfo({ ...clientInfo, gender: e.target.value as "male" | "female" })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="female">Kadın</option>
                                        <option value="male">Erkek</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Boy (cm)</Label>
                                    <Input
                                        type="number"
                                        value={clientInfo.height}
                                        onChange={(e) => setClientInfo({ ...clientInfo, height: parseInt(e.target.value) || 165 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kilo (kg)</Label>
                                    <Input
                                        type="number"
                                        value={clientInfo.weight}
                                        onChange={(e) => setClientInfo({ ...clientInfo, weight: parseInt(e.target.value) || 70 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Aktivite Seviyesi
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {activityLevels.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setClientInfo({ ...clientInfo, activityLevel: level.id })}
                                            className={cn(
                                                "p-3 rounded-lg border text-left transition-all",
                                                clientInfo.activityLevel === level.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <div className="font-medium text-sm">{level.name}</div>
                                            <div className="text-[10px] text-muted-foreground">{level.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Calories */}
                        <div className="border rounded-xl p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Flame className="w-4 h-4" />
                                Günlük Kalori Hedefi
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Hesaplama Yöntemi</Label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCalorieSettings({ ...calorieSettings, useAutoCalculation: true })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                                    calorieSettings.useAutoCalculation
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                Otomatik
                                            </button>
                                            <button
                                                onClick={() => setCalorieSettings({ ...calorieSettings, useAutoCalculation: false })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                                    !calorieSettings.useAutoCalculation
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                Manuel
                                            </button>
                                        </div>
                                    </div>

                                    {calorieSettings.useAutoCalculation ? (
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label>Kalori Açığı/Fazlası (kcal)</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={calorieSettings.calorieDeficit}
                                                        onChange={(e) => setCalorieSettings({ ...calorieSettings, calorieDeficit: parseInt(e.target.value) || 0 })}
                                                        placeholder="0"
                                                        className="flex-1"
                                                    />
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Negatif: Kilo verme (örn: -500)</p>
                                                            <p>Pozitif: Kilo alma (örn: +500)</p>
                                                            <p>Sıfır: Kilo koruma</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-muted-foreground">Hesaplanan Kalori:</span>
                                                    <span className="font-bold text-lg text-primary">{dailyCalories} kcal</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    (Mifflin-St Jeor formülü + Aktivite + Açık/Fazla)
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label>Manuel Kalori Girişi</Label>
                                            <Input
                                                type="number"
                                                min={800}
                                                max={5000}
                                                step={50}
                                                value={calorieSettings.dailyCalories}
                                                onChange={(e) => setCalorieSettings({ ...calorieSettings, dailyCalories: parseInt(e.target.value) || 2000 })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label>Makro Besin Dağılımı (Gram)</Label>
                                    <div className="space-y-3">
                                        {[
                                            { key: "protein", label: "Protein", color: "bg-blue-500", kcalPerGram: 4 },
                                            { key: "carbs", label: "Karbonhidrat", color: "bg-green-500", kcalPerGram: 4 },
                                            { key: "fat", label: "Yağ", color: "bg-yellow-500", kcalPerGram: 9 },
                                        ].map(({ key, label, color, kcalPerGram }) => {
                                            const gram = macroGrams[key as keyof typeof macroGrams];
                                            const percentage = macroPercentages[key as keyof typeof macroPercentages];
                                            const calories = gram * kcalPerGram;
                                            
                                            return (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("w-3 h-3 rounded-full", color)} />
                                                            <span className="text-sm font-medium">{label}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step={1}
                                                                value={gram || ""}
                                                                onChange={(e) => setMacroGrams({ ...macroGrams, [key]: parseInt(e.target.value) || 0 })}
                                                                className="w-20 h-8 text-center"
                                                                placeholder="0"
                                                            />
                                                            <span className="text-sm text-muted-foreground">g</span>
                                                            <span className="text-sm font-bold text-primary w-16 text-right">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                                        <span>{calories} kcal</span>
                                                        <span>{percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn("h-full transition-all", color)}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Toplam Kalori:</span>
                                            <span className="font-bold">{totalMacroCalories} kcal</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Hedef Kalori:</span>
                                            <span className="font-bold">{dailyCalories} kcal</span>
                                        </div>
                                        {totalMacroCalories !== dailyCalories && (
                                            <div className="flex justify-between text-xs pt-1 border-t">
                                                <span className="text-amber-600">Fark:</span>
                                                <span className={cn(
                                                    "font-bold",
                                                    totalMacroCalories > dailyCalories ? "text-red-600" : "text-blue-600"
                                                )}>
                                                    {totalMacroCalories > dailyCalories ? '+' : ''}{totalMacroCalories - dailyCalories} kcal
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {totalPercentage !== 100 && totalMacroCalories > 0 && (
                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                            <Calculator className="w-3 h-3" />
                                            Toplam Yüzde: {totalPercentage}% (100% olmalı)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label>Ek Notlar ve Öneriler</Label>
                            <textarea
                                value={planInfo.notes}
                                onChange={(e) => setPlanInfo({ ...planInfo, notes: e.target.value })}
                                placeholder="Önemli notlar, uyarılar, su tüketimi, vitamin takviyeleri vb..."
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Meal Plans */}
                {step === 2 && (() => {
                    // Calculate totals from all meals
                    const totalCalories = mealPlans.reduce((sum, meal) => 
                        sum + meal.foods.reduce((mealSum, food) => mealSum + (food.calories || 0), 0), 0
                    );
                    const totalProtein = mealPlans.reduce((sum, meal) => 
                        sum + meal.foods.reduce((mealSum, food) => mealSum + (food.protein || 0), 0), 0
                    );
                    const totalCarbs = mealPlans.reduce((sum, meal) => 
                        sum + meal.foods.reduce((mealSum, food) => mealSum + (food.carbs || 0), 0), 0
                    );
                    const totalFat = mealPlans.reduce((sum, meal) => 
                        sum + meal.foods.reduce((mealSum, food) => mealSum + (food.fat || 0), 0), 0
                    );

                    // Calculate differences
                    const calorieDiff = totalCalories - dailyCalories;
                    const proteinDiff = totalProtein - macroGrams.protein;
                    const carbsDiff = totalCarbs - macroGrams.carbs;
                    const fatDiff = totalFat - macroGrams.fat;

                    const getDiffColor = (diff: number) => {
                        if (Math.abs(diff) <= 5) return "text-green-600";
                        if (Math.abs(diff) <= 20) return "text-yellow-600";
                        return "text-red-600";
                    };

                    const formatDiff = (diff: number) => {
                        if (diff === 0) return "";
                        return diff > 0 ? `+${diff}` : `${diff}`;
                    };

                    return (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Utensils className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium">{mealPlans.length} Öğün</span>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={addMeal} className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Öğün Ekle
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Kalori</div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-xs">Hedef:</span>
                                                <strong className="text-foreground ml-1">{dailyCalories}</strong>
                                            </div>
                                            <span className="text-muted-foreground">|</span>
                                            <div>
                                                <span className="text-muted-foreground text-xs">Gerçek:</span>
                                                <strong className="text-foreground ml-1">{totalCalories}</strong>
                                            </div>
                                            {calorieDiff !== 0 && (
                                                <span className={cn("text-xs font-medium", getDiffColor(calorieDiff))}>
                                                    {formatDiff(calorieDiff)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Protein</div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-xs">Hedef:</span>
                                                <strong className="text-foreground ml-1">{macroGrams.protein}g</strong>
                                            </div>
                                            <span className="text-muted-foreground">|</span>
                                            <div>
                                                <span className="text-muted-foreground text-xs">Gerçek:</span>
                                                <strong className="text-foreground ml-1">{totalProtein}g</strong>
                                            </div>
                                            {proteinDiff !== 0 && (
                                                <span className={cn("text-xs font-medium", getDiffColor(proteinDiff))}>
                                                    {formatDiff(proteinDiff)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Karbonhidrat</div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-xs">Hedef:</span>
                                                <strong className="text-foreground ml-1">{macroGrams.carbs}g</strong>
                                            </div>
                                            <span className="text-muted-foreground">|</span>
                                            <div>
                                                <span className="text-muted-foreground text-xs">Gerçek:</span>
                                                <strong className="text-foreground ml-1">{totalCarbs}g</strong>
                                            </div>
                                            {carbsDiff !== 0 && (
                                                <span className={cn("text-xs font-medium", getDiffColor(carbsDiff))}>
                                                    {formatDiff(carbsDiff)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Yağ</div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-xs">Hedef:</span>
                                                <strong className="text-foreground ml-1">{macroGrams.fat}g</strong>
                                            </div>
                                            <span className="text-muted-foreground">|</span>
                                            <div>
                                                <span className="text-muted-foreground text-xs">Gerçek:</span>
                                                <strong className="text-foreground ml-1">{totalFat}g</strong>
                                            </div>
                                            {fatDiff !== 0 && (
                                                <span className={cn("text-xs font-medium", getDiffColor(fatDiff))}>
                                                    {formatDiff(fatDiff)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Meal Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mealPlans.map((meal, mealIndex) => {
                                const mealCalories = meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
                                const mealProtein = meal.foods.reduce((sum, f) => sum + (f.protein || 0), 0);
                                const mealCarbs = meal.foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
                                const mealFat = meal.foods.reduce((sum, f) => sum + (f.fat || 0), 0);

                                return (
                                    <button
                                        key={meal.id}
                                        onClick={() => setSelectedMealId(meal.id)}
                                        className="border rounded-xl p-4 text-left hover:border-primary/50 hover:shadow-md transition-all space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                                                    {mealIndex + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{meal.name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {meal.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-7 w-7"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                duplicateMeal(meal.id);
                                                            }}
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Çoğalt</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-7 w-7 text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeMeal(meal.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Sil</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Besin Sayısı:</span>
                                                <span className="font-medium">{meal.foods.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Kalori:</span>
                                                <span className="font-medium">{mealCalories} kcal</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                                                <div className="text-center">
                                                    <div className="text-xs font-medium text-blue-600">{mealProtein}g</div>
                                                    <div className="text-[10px] text-muted-foreground">Protein</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs font-medium text-green-600">{mealCarbs}g</div>
                                                    <div className="text-[10px] text-muted-foreground">Karb</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs font-medium text-yellow-600">{mealFat}g</div>
                                                    <div className="text-[10px] text-muted-foreground">Yağ</div>
                                                </div>
                                            </div>
                                        </div>

                                        {meal.notes && (
                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-muted-foreground line-clamp-2">{meal.notes}</p>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        </div>
                    );
                })()}

                {/* Step 3: PDF Download */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="border rounded-xl p-6 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Plan Hazır!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Diyet planınızı PDF olarak indirebilir veya önizleyebilirsiniz
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold">{mealPlans.length}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Öğün</div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold">{mealPlans.reduce((sum, m) => sum + m.foods.length, 0)}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Besin</div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold">{dailyCalories}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Kalori</div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold">{planInfo.duration}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Hafta</div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center pt-4">
                                <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    Önizle
                                </Button>
                                <Button onClick={handleDownloadPDF} className="gap-2">
                                    <Download className="w-4 h-4" />
                                    PDF İndir
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={step === 1 ? () => navigate(-1) : handleBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {step === 1 ? "İptal" : "Geri"}
                    </Button>
                    
                    {step < 3 && (
                        <Button onClick={handleNext} className="gap-2">
                            İleri
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Meal Drawer */}
                <Sheet open={selectedMealId !== null} onOpenChange={(open) => !open && setSelectedMealId(null)}>
                    <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto px-6">
                        {selectedMealId && (() => {
                            const meal = mealPlans.find(m => m.id === selectedMealId);
                            if (!meal) return null;
                            const mealCalories = meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
                            const mealProtein = meal.foods.reduce((sum, f) => sum + (f.protein || 0), 0);
                            const mealCarbs = meal.foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
                            const mealFat = meal.foods.reduce((sum, f) => sum + (f.fat || 0), 0);

                            return (
                                <>
                                    <SheetHeader className="px-0 pb-0">
                                        <SheetTitle className="text-lg">
                                            Öğün Düzenle
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 space-y-6 px-0">
                                        {/* Meal Name and Time */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Öğün Adı</Label>
                                                <Input
                                                    value={meal.name}
                                                    onChange={(e) => updateMeal(meal.id, { name: e.target.value })}
                                                    placeholder="Örn: Kahvaltı, Öğle Yemeği, Akşam Yemeği"
                                                    className="h-10 text-base font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Saat
                                                </Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={23}
                                                        value={meal.time ? (parseInt(meal.time.split(':')[0]) || 0) : ''}
                                                        onChange={(e) => {
                                                            const hourVal = e.target.value === '' ? '00' : String(Math.max(0, Math.min(23, parseInt(e.target.value) || 0))).padStart(2, '0');
                                                            const minute = meal.time && meal.time.includes(':') ? meal.time.split(':')[1] : '00';
                                                            updateMeal(meal.id, { time: `${hourVal}:${minute}` });
                                                        }}
                                                        className="h-10 w-20 text-center"
                                                        placeholder="00"
                                                    />
                                                    <span className="text-muted-foreground font-medium">:</span>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={59}
                                                        value={meal.time ? (parseInt(meal.time.split(':')[1]) || 0) : ''}
                                                        onChange={(e) => {
                                                            const minuteVal = e.target.value === '' ? '00' : String(Math.max(0, Math.min(59, parseInt(e.target.value) || 0))).padStart(2, '0');
                                                            const hour = meal.time && meal.time.includes(':') ? meal.time.split(':')[0] : '00';
                                                            updateMeal(meal.id, { time: `${hour}:${minuteVal}` });
                                                        }}
                                                        className="h-10 w-20 text-center"
                                                        placeholder="00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Foods Table */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold">Besinler</Label>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addFoodToMeal(meal.id)}
                                                    className="gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Besin Ekle
                                                </Button>
                                            </div>
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-xs text-muted-foreground border-b bg-muted/30">
                                                            <th className="text-left py-3 px-4 font-medium">Besin</th>
                                                            <th className="text-left py-3 px-4 font-medium">Porsiyon</th>
                                                            <th className="text-center py-3 font-medium w-20">Kalori</th>
                                                            <th className="text-center py-3 font-medium w-16">P (g)</th>
                                                            <th className="text-center py-3 font-medium w-16">K (g)</th>
                                                            <th className="text-center py-3 font-medium w-16">Y (g)</th>
                                                            <th className="w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {meal.foods.length > 0 ? (
                                                            meal.foods.map((food) => (
                                                                <tr key={food.id} className="border-b border-dashed last:border-0">
                                                                    <td className="py-3 px-4">
                                                                        <Input
                                                                            value={food.name}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { name: e.target.value })}
                                                                            placeholder="Besin adı"
                                                                            className="h-9"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <Input
                                                                            value={food.portion}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { portion: e.target.value })}
                                                                            placeholder="1 porsiyon"
                                                                            className="h-9"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <Input
                                                                            type="number"
                                                                            value={food.calories || ""}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { calories: parseInt(e.target.value) || 0 })}
                                                                            className="h-9 w-full text-center"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <Input
                                                                            type="number"
                                                                            value={food.protein || ""}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { protein: parseInt(e.target.value) || 0 })}
                                                                            className="h-9 w-full text-center"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <Input
                                                                            type="number"
                                                                            value={food.carbs || ""}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { carbs: parseInt(e.target.value) || 0 })}
                                                                            className="h-9 w-full text-center"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <Input
                                                                            type="number"
                                                                            value={food.fat || ""}
                                                                            onChange={(e) => updateFood(meal.id, food.id, { fat: parseInt(e.target.value) || 0 })}
                                                                            className="h-9 w-full text-center"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeFood(meal.id, food.id)}
                                                                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                                    Henüz besin eklenmemiş. "Besin Ekle" butonuna tıklayarak başlayın.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    {meal.foods.length > 0 && (
                                                        <tfoot>
                                                            <tr className="bg-muted/30 font-medium">
                                                                <td colSpan={2} className="py-3 px-4">
                                                                    <span className="text-xs text-muted-foreground">Toplam</span>
                                                                </td>
                                                                <td className="py-3 text-center font-semibold">{mealCalories}</td>
                                                                <td className="py-3 text-center font-semibold">{mealProtein}</td>
                                                                <td className="py-3 text-center font-semibold">{mealCarbs}</td>
                                                                <td className="py-3 text-center font-semibold">{mealFat}</td>
                                                                <td></td>
                                                            </tr>
                                                        </tfoot>
                                                    )}
                                                </table>
                                            </div>
                                        </div>

                                        {/* Meal Notes */}
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">Öğün Notu</Label>
                                            <textarea
                                                value={meal.notes}
                                                onChange={(e) => updateMeal(meal.id, { notes: e.target.value })}
                                                placeholder="Bu öğün için notlar..."
                                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </SheetContent>
                </Sheet>

                {/* Preview Dialog */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                PDF Önizleme
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 p-4 text-sm">
                            <div className="text-center border-b pb-4">
                                <h1 className="text-xl font-bold">{planInfo.title}</h1>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {new Date(planInfo.startDate).toLocaleDateString('tr-TR')} - {new Date(new Date(planInfo.startDate).getTime() + planInfo.duration * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')} ({planInfo.duration} Hafta)
                                </p>
                            </div>

                            {mealPlans.map((meal, i) => (
                                <div key={meal.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-primary text-primary-foreground px-4 py-2 font-medium flex justify-between">
                                        <span>{i + 1}. {meal.name}</span>
                                        <span className="text-xs opacity-90">{meal.time}</span>
                                    </div>
                                    <div className="p-4">
                                        {meal.foods.length > 0 ? (
                                            <div className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <div key={food.id} className="flex justify-between py-1 border-b border-dashed last:border-0">
                                                        <span className="font-medium">{food.name || '-'}</span>
                                                        <span className="text-muted-foreground">{food.portion || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground italic">Besin eklenmemiş</p>
                                        )}
                                        {meal.notes && (
                                            <p className="text-xs text-amber-600 mt-2 pt-2 border-t">📝 {meal.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {planInfo.notes && (
                                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <h3 className="font-semibold text-sm text-green-700 dark:text-green-300 mb-2">📋 Ek Notlar</h3>
                                    <p className="text-sm text-green-600 dark:text-green-400">{planInfo.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Kapat</Button>
                            <Button onClick={handleDownloadPDF} className="gap-2">
                                <Download className="w-4 h-4" />
                                PDF İndir
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
