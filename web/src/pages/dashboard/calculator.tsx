import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { TrendingUp, Activity, Target, Scale, Droplets, ArrowRight, GlassWater, Beef, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BMIResult {
    bmi: number;
    category: string;
    description: string;
}

interface BMRResult {
    bmr: number;
    formula: string;
    unit: string;
}

interface TDEEResult {
    tdee: number;
    bmr: number;
    activityLevel: string;
    multiplier: number;
    unit: string;
}

interface MacrosResult {
    totalCalories: number;
    protein: { percent: number; calories: number; grams: number };
    carbohydrates: { percent: number; calories: number; grams: number };
    fat: { percent: number; calories: number; grams: number };
}

interface IdealWeightResult {
    idealWeightKg: number;
    formula: string;
    unit: string;
}

interface BodyFatResult {
    bodyFatPercent: number;
    category: string;
    method: string;
    unit: string;
}

interface WaterIntakeResult {
    waterIntakeMl: number;
    waterIntakeL: number;
    glasses: number;
    activityLevel: string;
    season: string;
    recommendation: string;
    unit: string;
}

interface ProteinNeedsResult {
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

interface CalorieDeficitSurplusResult {
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

type CalculatorType = "bmi" | "bmr" | "tdee" | "macros" | "ideal" | "bodyfat" | "water" | "protein" | "caloriedeficit" | null;

export default function CalculatorPage() {
    const [openSheet, setOpenSheet] = useState<CalculatorType>(null);
    
    // Form states
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [proteinPercent, setProteinPercent] = useState("30");
    const [carbPercent, setCarbPercent] = useState("40");
    const [fatPercent, setFatPercent] = useState("30");
    const [neckCm, setNeckCm] = useState("");
    const [waistCm, setWaistCm] = useState("");
    const [hipCm, setHipCm] = useState("");
    const [bmrFormula, setBmrFormula] = useState("mifflin");
    const [idealWeightFormula, setIdealWeightFormula] = useState("robinson");
    const [totalCalories, setTotalCalories] = useState("");
    const [season, setSeason] = useState("normal");
    const [proteinGoal, setProteinGoal] = useState("maintenance");
    const [currentWeightKg, setCurrentWeightKg] = useState("");
    const [targetWeightKg, setTargetWeightKg] = useState("");
    const [durationWeeks, setDurationWeeks] = useState("");

    // Results
    const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
    const [bmrResult, setBmrResult] = useState<BMRResult | null>(null);
    const [tdeeResult, setTdeeResult] = useState<TDEEResult | null>(null);
    const [macrosResult, setMacrosResult] = useState<MacrosResult | null>(null);
    const [idealWeightResult, setIdealWeightResult] = useState<IdealWeightResult | null>(null);
    const [bodyFatResult, setBodyFatResult] = useState<BodyFatResult | null>(null);
    const [waterIntakeResult, setWaterIntakeResult] = useState<WaterIntakeResult | null>(null);
    const [proteinNeedsResult, setProteinNeedsResult] = useState<ProteinNeedsResult | null>(null);
    const [calorieDeficitSurplusResult, setCalorieDeficitSurplusResult] = useState<CalorieDeficitSurplusResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculateBMI = async () => {
        if (!weightKg || !heightCm) {
            toast.error("Kilo ve boy değerleri gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/bmi"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setBmiResult(data);
                toast.success("BMI hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateBMR = async () => {
        if (!weightKg || !heightCm || !age || !gender) {
            toast.error("Tüm değerler gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/bmr"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    formula: bmrFormula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setBmrResult(data);
                toast.success("BMR hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTDEE = async () => {
        if (!bmrResult?.bmr || !activityLevel) {
            toast.error("Önce BMR hesaplamanız gerekiyor");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/tdee"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    bmr: bmrResult.bmr,
                    activityLevel,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setTdeeResult(data);
                setTotalCalories(data.tdee.toString());
                toast.success("TDEE hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateMacros = async () => {
        if (!totalCalories) {
            toast.error("Toplam kalori gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/macros"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    totalCalories: parseFloat(totalCalories),
                    proteinPercent: parseFloat(proteinPercent),
                    carbPercent: parseFloat(carbPercent),
                    fatPercent: parseFloat(fatPercent),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMacrosResult(data);
                toast.success("Makro besinler hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateIdealWeight = async () => {
        if (!heightCm || !gender) {
            toast.error("Boy ve cinsiyet gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/ideal-weight"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    heightCm: parseFloat(heightCm),
                    gender,
                    formula: idealWeightFormula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIdealWeightResult(data);
                toast.success("İdeal kilo hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateBodyFat = async () => {
        if (!weightKg || !heightCm || !age || !gender || !neckCm || !waistCm) {
            toast.error("Tüm gerekli değerler girilmelidir");
            return;
        }

        if ((gender === "kadın" || gender === "female" || gender === "f") && !hipCm) {
            toast.error("Kadınlar için kalça ölçüsü gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/body-fat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    neckCm: parseFloat(neckCm),
                    waistCm: parseFloat(waistCm),
                    hipCm: hipCm ? parseFloat(hipCm) : null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setBodyFatResult(data);
                toast.success("Vücut yağ yüzdesi hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateWaterIntake = async () => {
        if (!weightKg || !activityLevel) {
            toast.error("Kilo ve aktivite seviyesi gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/water-intake"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    activityLevel,
                    season: season || 'normal',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setWaterIntakeResult(data);
                toast.success("Su ihtiyacı hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProteinNeeds = async () => {
        if (!weightKg || !activityLevel) {
            toast.error("Kilo ve aktivite seviyesi gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/protein-needs"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    activityLevel,
                    goal: proteinGoal || 'maintenance',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setProteinNeedsResult(data);
                toast.success("Protein ihtiyacı hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateCalorieDeficitSurplus = async () => {
        if (!currentWeightKg || !targetWeightKg || !durationWeeks) {
            toast.error("Mevcut kilo, hedef kilo ve süre gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/calorie-deficit-surplus"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentWeightKg: parseFloat(currentWeightKg),
                    targetWeightKg: parseFloat(targetWeightKg),
                    durationWeeks: parseInt(durationWeeks),
                    activityLevel: activityLevel || 'moderate',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setCalorieDeficitSurplusResult(data);
                toast.success("Kalori açığı/fazlası hesaplandı");
            } else {
                toast.error(data.message || "Hesaplama başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getBMIColor = (bmi: number) => {
        if (bmi < 18.5) return "text-blue-600";
        if (bmi < 25) return "text-green-600";
        if (bmi < 30) return "text-yellow-600";
        return "text-red-600";
    };

    const calculators = [
        {
            id: "bmi",
            title: "BMI Hesaplayıcı",
            description: "Vücut Kitle İndeksi",
            icon: Scale,
            color: "text-blue-600",
        },
        {
            id: "bmr",
            title: "BMR Hesaplayıcı",
            description: "Bazal Metabolizma Hızı",
            icon: Activity,
            color: "text-green-600",
        },
        {
            id: "tdee",
            title: "TDEE Hesaplayıcı",
            description: "Toplam Günlük Enerji Harcaması",
            icon: TrendingUp,
            color: "text-purple-600",
        },
        {
            id: "macros",
            title: "Makro Besin",
            description: "Protein, Karbonhidrat, Yağ",
            icon: Target,
            color: "text-orange-600",
        },
        {
            id: "ideal",
            title: "İdeal Kilo",
            description: "Hedef kilo hesaplama",
            icon: Target,
            color: "text-pink-600",
        },
        {
            id: "bodyfat",
            title: "Vücut Yağ Yüzdesi",
            description: "Navy Method ile hesaplama",
            icon: Droplets,
            color: "text-cyan-600",
        },
        {
            id: "water",
            title: "Su İhtiyacı",
            description: "Günlük su ihtiyacı hesaplama",
            icon: GlassWater,
            color: "text-blue-500",
        },
        {
            id: "protein",
            title: "Protein İhtiyacı",
            description: "Günlük protein ihtiyacı",
            icon: Beef,
            color: "text-red-600",
        },
        {
            id: "caloriedeficit",
            title: "Kalori Açığı/Fazlası",
            description: "Hedef kiloya ulaşma planı",
            icon: TrendingDown,
            color: "text-indigo-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Beslenme Hesaplayıcıları</h1>
                </div>
                <p className="text-muted-foreground">
                    BMI, BMR, TDEE, makro besinler ve daha fazlasını hesaplayın
                </p>
            </div>

            {/* Calculator Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calculators.map((calc) => {
                    const Icon = calc.icon;
                    return (
                        <button
                            key={calc.id}
                            onClick={() => setOpenSheet(calc.id as CalculatorType)}
                            className="border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className={`h-5 w-5 ${calc.color}`} />
                                        <h3 className="font-semibold">{calc.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* BMI Sheet */}
            <Sheet open={openSheet === "bmi"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-blue-600" />
                            BMI (Vücut Kitle İndeksi) Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Vücut kitle indeksinizi hesaplayın ve ideal kilo aralığınızı öğrenin
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight-bmi">Kilo (kg)</Label>
                                <Input
                                    id="weight-bmi"
                                    type="number"
                                    placeholder="70"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height-bmi">Boy (cm)</Label>
                                <Input
                                    id="height-bmi"
                                    type="number"
                                    placeholder="175"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button onClick={calculateBMI} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "BMI Hesapla"}
                        </Button>

                        {bmiResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">BMI Değeri</span>
                                    <span className={`text-2xl font-bold ${getBMIColor(bmiResult.bmi)}`}>
                                        {bmiResult.bmi}
                                    </span>
                                </div>
                                <Badge variant="outline" className="mb-2">
                                    {bmiResult.category}
                                </Badge>
                                <p className="text-sm text-muted-foreground">{bmiResult.description}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* BMR Sheet */}
            <Sheet open={openSheet === "bmr"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            BMR (Bazal Metabolizma Hızı) Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Vücudunuzun dinlenme halinde harcadığı minimum kalori miktarını hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight-bmr">Kilo (kg)</Label>
                                <Input
                                    id="weight-bmr"
                                    type="number"
                                    placeholder="70"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height-bmr">Boy (cm)</Label>
                                <Input
                                    id="height-bmr"
                                    type="number"
                                    placeholder="175"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age-bmr">Yaş</Label>
                                <Input
                                    id="age-bmr"
                                    type="number"
                                    placeholder="30"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender-bmr">Cinsiyet</Label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger id="gender-bmr">
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="erkek">Erkek</SelectItem>
                                        <SelectItem value="kadın">Kadın</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="formula-bmr">Formül</Label>
                                <Select value={bmrFormula} onValueChange={setBmrFormula}>
                                    <SelectTrigger id="formula-bmr">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mifflin">Mifflin-St Jeor (Önerilen)</SelectItem>
                                        <SelectItem value="harris">Harris-Benedict</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={calculateBMR} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "BMR Hesapla"}
                        </Button>

                        {bmrResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">BMR Değeri</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {bmrResult.bmr} {bmrResult.unit}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">Formül: {bmrResult.formula}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* TDEE Sheet */}
            <Sheet open={openSheet === "tdee"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            TDEE (Toplam Günlük Enerji Harcaması) Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Günlük aktivite seviyenize göre toplam kalori ihtiyacınızı hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        {!bmrResult && (
                            <div className="p-4 rounded-lg border border-yellow-500/50">
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Önce BMR hesaplamanız gerekiyor.
                                </p>
                            </div>
                        )}
                        {bmrResult && (
                            <div className="p-4 rounded-lg border mb-4">
                                <p className="text-sm font-medium">BMR: {bmrResult.bmr} kcal/gün</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="activity-tdee">Aktivite Seviyesi</Label>
                            <Select value={activityLevel} onValueChange={setActivityLevel}>
                                <SelectTrigger id="activity-tdee">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Hareketsiz (günlük egzersiz yok)</SelectItem>
                                    <SelectItem value="light">Hafif aktif (haftada 1-3 gün hafif egzersiz)</SelectItem>
                                    <SelectItem value="moderate">Orta aktif (haftada 3-5 gün orta egzersiz)</SelectItem>
                                    <SelectItem value="active">Çok aktif (haftada 6-7 gün yoğun egzersiz)</SelectItem>
                                    <SelectItem value="very_active">Aşırı aktif (günlük çok yoğun egzersiz, fiziksel iş)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={calculateTDEE} disabled={loading || !bmrResult} className="w-full">
                            {loading ? "Hesaplanıyor..." : "TDEE Hesapla"}
                        </Button>

                        {tdeeResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">TDEE Değeri</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {tdeeResult.tdee} {tdeeResult.unit}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{tdeeResult.activityLevel}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Çarpan: {tdeeResult.multiplier}x
                                </p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Macros Sheet */}
            <Sheet open={openSheet === "macros"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-orange-600" />
                            Makro Besin Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Günlük kalori ihtiyacınıza göre protein, karbonhidrat ve yağ dağılımını hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories-macros">Toplam Kalori (kcal/gün)</Label>
                            <Input
                                id="calories-macros"
                                type="number"
                                placeholder="2000"
                                value={totalCalories}
                                onChange={(e) => setTotalCalories(e.target.value)}
                            />
                            {tdeeResult && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTotalCalories(tdeeResult.tdee.toString())}
                                    className="mt-2 w-full"
                                >
                                    TDEE Değerini Kullan ({tdeeResult.tdee} kcal)
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="protein-macros">Protein (%)</Label>
                                <Input
                                    id="protein-macros"
                                    type="number"
                                    value={proteinPercent}
                                    onChange={(e) => setProteinPercent(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="carb-macros">Karbonhidrat (%)</Label>
                                <Input
                                    id="carb-macros"
                                    type="number"
                                    value={carbPercent}
                                    onChange={(e) => setCarbPercent(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fat-macros">Yağ (%)</Label>
                                <Input
                                    id="fat-macros"
                                    type="number"
                                    value={fatPercent}
                                    onChange={(e) => setFatPercent(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground">
                                Toplam: {parseFloat(proteinPercent || "0") + parseFloat(carbPercent || "0") + parseFloat(fatPercent || "0")}%
                            </p>
                        </div>
                        <Button onClick={calculateMacros} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "Makro Besinleri Hesapla"}
                        </Button>

                        {macrosResult && (
                            <div className="mt-4 space-y-4">
                                <div className="p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Toplam Kalori</span>
                                        <span className="text-xl font-bold">{macrosResult.totalCalories} kcal</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">Protein</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.protein.percent}%</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{macrosResult.protein.grams}g</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.protein.calories} kcal</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">Karbonhidrat</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.carbohydrates.percent}%</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{macrosResult.carbohydrates.grams}g</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.carbohydrates.calories} kcal</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">Yağ</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.fat.percent}%</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{macrosResult.fat.grams}g</span>
                                                <p className="text-xs text-muted-foreground">{macrosResult.fat.calories} kcal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Ideal Weight Sheet */}
            <Sheet open={openSheet === "ideal"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-pink-600" />
                            İdeal Kilo Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="height-ideal">Boy (cm)</Label>
                                <Input
                                    id="height-ideal"
                                    type="number"
                                    placeholder="175"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender-ideal">Cinsiyet</Label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger id="gender-ideal">
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="erkek">Erkek</SelectItem>
                                        <SelectItem value="kadın">Kadın</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="formula-ideal">Formül</Label>
                                <Select value={idealWeightFormula} onValueChange={setIdealWeightFormula}>
                                    <SelectTrigger id="formula-ideal">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="robinson">Robinson (Önerilen)</SelectItem>
                                        <SelectItem value="miller">Miller</SelectItem>
                                        <SelectItem value="devine">Devine</SelectItem>
                                        <SelectItem value="hamwi">Hamwi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={calculateIdealWeight} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "İdeal Kilo Hesapla"}
                        </Button>

                        {idealWeightResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">İdeal Kilo</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {idealWeightResult.idealWeightKg} {idealWeightResult.unit}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">Formül: {idealWeightResult.formula}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Body Fat Sheet */}
            <Sheet open={openSheet === "bodyfat"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-cyan-600" />
                            Vücut Yağ Yüzdesi Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Navy Method ile vücut yağ yüzdenizi hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight-bodyfat">Kilo (kg)</Label>
                                <Input
                                    id="weight-bodyfat"
                                    type="number"
                                    placeholder="70"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height-bodyfat">Boy (cm)</Label>
                                <Input
                                    id="height-bodyfat"
                                    type="number"
                                    placeholder="175"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age-bodyfat">Yaş</Label>
                                <Input
                                    id="age-bodyfat"
                                    type="number"
                                    placeholder="30"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender-bodyfat">Cinsiyet</Label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger id="gender-bodyfat">
                                        <SelectValue placeholder="Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="erkek">Erkek</SelectItem>
                                        <SelectItem value="kadın">Kadın</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="neck-bodyfat">Boyun Çevresi (cm)</Label>
                                <Input
                                    id="neck-bodyfat"
                                    type="number"
                                    placeholder="38"
                                    value={neckCm}
                                    onChange={(e) => setNeckCm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="waist-bodyfat">Bel Çevresi (cm)</Label>
                                <Input
                                    id="waist-bodyfat"
                                    type="number"
                                    placeholder="85"
                                    value={waistCm}
                                    onChange={(e) => setWaistCm(e.target.value)}
                                />
                            </div>
                            {(gender === "kadın" || gender === "female" || gender === "f") && (
                                <div className="space-y-2">
                                    <Label htmlFor="hip-bodyfat">Kalça Çevresi (cm) *</Label>
                                    <Input
                                        id="hip-bodyfat"
                                        type="number"
                                        placeholder="95"
                                        value={hipCm}
                                        onChange={(e) => setHipCm(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">* Kadınlar için zorunlu</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={calculateBodyFat} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "Vücut Yağ Yüzdesi Hesapla"}
                        </Button>

                        {bodyFatResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Vücut Yağ Yüzdesi</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {bodyFatResult.bodyFatPercent} {bodyFatResult.unit}
                                    </span>
                                </div>
                                <Badge variant="outline" className="mb-2">
                                    {bodyFatResult.category}
                                </Badge>
                                <p className="text-xs text-muted-foreground">Yöntem: {bodyFatResult.method}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Water Intake Sheet */}
            <Sheet open={openSheet === "water"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <GlassWater className="h-5 w-5 text-blue-500" />
                            Su İhtiyacı Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Kilo, aktivite düzeyi ve mevsimsel faktörlere göre günlük su ihtiyacınızı hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight-water">Kilo (kg)</Label>
                                <Input
                                    id="weight-water"
                                    type="number"
                                    placeholder="70"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity-water">Aktivite Seviyesi</Label>
                                <Select value={activityLevel} onValueChange={setActivityLevel}>
                                    <SelectTrigger id="activity-water">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Hareketsiz (günlük egzersiz yok)</SelectItem>
                                        <SelectItem value="light">Hafif aktif (haftada 1-3 gün hafif egzersiz)</SelectItem>
                                        <SelectItem value="moderate">Orta aktif (haftada 3-5 gün orta egzersiz)</SelectItem>
                                        <SelectItem value="active">Çok aktif (haftada 6-7 gün yoğun egzersiz)</SelectItem>
                                        <SelectItem value="very_active">Aşırı aktif (günlük çok yoğun egzersiz, fiziksel iş)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="season-water">Mevsim</Label>
                                <Select value={season} onValueChange={setSeason}>
                                    <SelectTrigger id="season-water">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal/İlkbahar/Sonbahar</SelectItem>
                                        <SelectItem value="yaz">Yaz</SelectItem>
                                        <SelectItem value="kış">Kış</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={calculateWaterIntake} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "Su İhtiyacı Hesapla"}
                        </Button>

                        {waterIntakeResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Günlük Su İhtiyacı</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {waterIntakeResult.waterIntakeL} {waterIntakeResult.unit}
                                    </span>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Mililitre</span>
                                        <span className="text-sm font-medium">{waterIntakeResult.waterIntakeMl} ml</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Bardak (250ml)</span>
                                        <span className="text-sm font-medium">{waterIntakeResult.glasses} bardak</span>
                                    </div>
                                </div>
                                <Separator className="my-3" />
                                <p className="text-xs text-muted-foreground mb-2">
                                    Aktivite: {waterIntakeResult.activityLevel}
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Mevsim: {waterIntakeResult.season}
                                </p>
                                <p className="text-sm mt-3">{waterIntakeResult.recommendation}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Protein Needs Sheet */}
            <Sheet open={openSheet === "protein"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Beef className="h-5 w-5 text-red-600" />
                            Protein İhtiyacı Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Kilo, aktivite düzeyi ve hedefinize göre günlük protein ihtiyacınızı hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight-protein">Kilo (kg)</Label>
                                <Input
                                    id="weight-protein"
                                    type="number"
                                    placeholder="70"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity-protein">Aktivite Seviyesi</Label>
                                <Select value={activityLevel} onValueChange={setActivityLevel}>
                                    <SelectTrigger id="activity-protein">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Hareketsiz (günlük egzersiz yok)</SelectItem>
                                        <SelectItem value="light">Hafif aktif (haftada 1-3 gün hafif egzersiz)</SelectItem>
                                        <SelectItem value="moderate">Orta aktif (haftada 3-5 gün orta egzersiz)</SelectItem>
                                        <SelectItem value="active">Çok aktif (haftada 6-7 gün yoğun egzersiz)</SelectItem>
                                        <SelectItem value="very_active">Aşırı aktif (günlük çok yoğun egzersiz, fiziksel iş)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goal-protein">Hedef</Label>
                                <Select value={proteinGoal} onValueChange={setProteinGoal}>
                                    <SelectTrigger id="goal-protein">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="maintenance">Kilo Koruma</SelectItem>
                                        <SelectItem value="weight_loss">Kilo Verme</SelectItem>
                                        <SelectItem value="muscle_gain">Kas Kazanma</SelectItem>
                                        <SelectItem value="athletic">Atletik Performans</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={calculateProteinNeeds} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "Protein İhtiyacı Hesapla"}
                        </Button>

                        {proteinNeedsResult && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Günlük Protein İhtiyacı</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {proteinNeedsResult.proteinGrams} {proteinNeedsResult.unit}
                                    </span>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Protein/kg</span>
                                        <span className="text-sm font-medium">{proteinNeedsResult.proteinPerKg} g/kg</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Kalori</span>
                                        <span className="text-sm font-medium">{proteinNeedsResult.proteinCalories} kcal</span>
                                    </div>
                                </div>
                                <Separator className="my-3" />
                                <div className="space-y-2">
                                    <p className="text-xs font-medium">Örnek Gıda Eşdeğerleri:</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Tavuk Göğsü (100g)</span>
                                        <span className="font-medium">{proteinNeedsResult.examples.chickenBreast100g} porsiyon</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Yumurta</span>
                                        <span className="font-medium">{proteinNeedsResult.examples.eggs} adet</span>
                                    </div>
                                </div>
                                <Separator className="my-3" />
                                <p className="text-xs text-muted-foreground mb-2">
                                    Aktivite: {proteinNeedsResult.activityLevel}
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Hedef: {proteinNeedsResult.goal}
                                </p>
                                <p className="text-sm mt-3">{proteinNeedsResult.recommendation}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Calorie Deficit/Surplus Sheet */}
            <Sheet open={openSheet === "caloriedeficit"} onOpenChange={(open) => !open && setOpenSheet(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl px-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-indigo-600" />
                            Kalori Açığı/Fazlası Hesaplayıcı
                        </SheetTitle>
                        <SheetDescription>
                            Mevcut kilonuzdan hedef kilonuza ulaşmak için gerekli kalori açığı veya fazlasını hesaplayın
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-weight-deficit">Mevcut Kilo (kg)</Label>
                                <Input
                                    id="current-weight-deficit"
                                    type="number"
                                    placeholder="80"
                                    value={currentWeightKg}
                                    onChange={(e) => setCurrentWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target-weight-deficit">Hedef Kilo (kg)</Label>
                                <Input
                                    id="target-weight-deficit"
                                    type="number"
                                    placeholder="70"
                                    value={targetWeightKg}
                                    onChange={(e) => setTargetWeightKg(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration-deficit">Süre (Hafta)</Label>
                                <Input
                                    id="duration-deficit"
                                    type="number"
                                    placeholder="12"
                                    value={durationWeeks}
                                    onChange={(e) => setDurationWeeks(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity-deficit">Aktivite Seviyesi</Label>
                                <Select value={activityLevel} onValueChange={setActivityLevel}>
                                    <SelectTrigger id="activity-deficit">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Hareketsiz (günlük egzersiz yok)</SelectItem>
                                        <SelectItem value="light">Hafif aktif (haftada 1-3 gün hafif egzersiz)</SelectItem>
                                        <SelectItem value="moderate">Orta aktif (haftada 3-5 gün orta egzersiz)</SelectItem>
                                        <SelectItem value="active">Çok aktif (haftada 6-7 gün yoğun egzersiz)</SelectItem>
                                        <SelectItem value="very_active">Aşırı aktif (günlük çok yoğun egzersiz, fiziksel iş)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={calculateCalorieDeficitSurplus} disabled={loading} className="w-full">
                            {loading ? "Hesaplanıyor..." : "Kalori Açığı/Fazlası Hesapla"}
                        </Button>

                        {calorieDeficitSurplusResult && (
                            <div className="mt-4 space-y-4">
                                <div className="p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">{calorieDeficitSurplusResult.type}</span>
                                        <Badge variant={calorieDeficitSurplusResult.isSafe ? "default" : "destructive"}>
                                            {calorieDeficitSurplusResult.isSafe ? "Güvenli" : "Dikkat"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">{calorieDeficitSurplusResult.description}</p>
                                    <Separator className="my-3" />
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Günlük Kalori Farkı</span>
                                            <span className={`text-lg font-bold ${calorieDeficitSurplusResult.dailyCalorieDifference > 0 ? 'text-green-600' : calorieDeficitSurplusResult.dailyCalorieDifference < 0 ? 'text-red-600' : 'text-primary'}`}>
                                                {calorieDeficitSurplusResult.dailyCalorieDifference > 0 ? '+' : ''}{calorieDeficitSurplusResult.dailyCalorieDifference} kcal
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Önerilen Günlük Kalori</span>
                                            <span className="text-lg font-bold text-primary">
                                                {calorieDeficitSurplusResult.recommendedDailyCalories} kcal
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Tahmini TDEE</span>
                                            <span className="text-sm font-medium">
                                                {calorieDeficitSurplusResult.estimatedTDEE} kcal
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Haftalık Kilo Değişimi</span>
                                            <span className={`text-sm font-bold ${calorieDeficitSurplusResult.weeklyWeightChange > 0 ? 'text-green-600' : calorieDeficitSurplusResult.weeklyWeightChange < 0 ? 'text-red-600' : 'text-primary'}`}>
                                                {calorieDeficitSurplusResult.weeklyWeightChange > 0 ? '+' : ''}{calorieDeficitSurplusResult.weeklyWeightChange} kg/hafta
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg border">
                                    <p className="text-xs font-medium mb-2">Özet Bilgiler:</p>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>Kilo Farkı: {calorieDeficitSurplusResult.weightDifferenceKg > 0 ? '+' : ''}{calorieDeficitSurplusResult.weightDifferenceKg} kg</p>
                                        <p>Süre: {calorieDeficitSurplusResult.durationWeeks} hafta</p>
                                        <p>Aktivite: {calorieDeficitSurplusResult.activityLevel}</p>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-lg border ${calorieDeficitSurplusResult.isSafe ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800'}`}>
                                    <p className="text-sm font-medium mb-1">
                                        {calorieDeficitSurplusResult.isSafe ? '✓ Güvenli Aralık' : '⚠ Dikkat Gerekli'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{calorieDeficitSurplusResult.safetyMessage}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
