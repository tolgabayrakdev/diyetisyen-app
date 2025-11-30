import { useState } from "react";
import { 
    ArrowRight, 
    Scale, 
    Activity, 
    TrendingUp, 
    Target, 
    Droplets, 
    GlassWater, 
    Beef, 
    TrendingDown, 
    Heart, 
    Ruler, 
    Users, 
    Calendar, 
    Square 
} from "lucide-react";
import type { CalculatorType } from "@/types/calculator-types";
import {
    BMICalculator,
    BMRCalculator,
    TDEECalculator,
    MacrosCalculator,
    IdealWeightCalculator,
    BodyFatCalculator,
    WaterIntakeCalculator,
    ProteinNeedsCalculator,
    CalorieDeficitCalculator,
    WHRCalculator,
    WHtRCalculator,
    LMBCalculator,
    FFMICalculator,
    MetabolicAgeCalculator,
    BSACalculator,
} from "@/components/calculator";

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
    {
        id: "whr",
        title: "Bel-Kalça Oranı",
        description: "Kardiyovasküler risk değerlendirmesi",
        icon: Heart,
        color: "text-rose-600",
    },
    {
        id: "whtr",
        title: "Bel-Boy Oranı",
        description: "Vücut kompozisyonu analizi",
        icon: Ruler,
        color: "text-teal-600",
    },
    {
        id: "lbm",
        title: "Yağsız Vücut Kütlesi",
        description: "Kas ve yağsız doku analizi",
        icon: Users,
        color: "text-amber-600",
    },
    {
        id: "ffmi",
        title: "Yağsız Kütle İndeksi",
        description: "Sporcu performans değerlendirmesi",
        icon: Target,
        color: "text-violet-600",
    },
    {
        id: "metabolicage",
        title: "Metabolik Yaş",
        description: "Metabolizma sağlığı analizi",
        icon: Calendar,
        color: "text-emerald-600",
    },
    {
        id: "bsa",
        title: "Vücut Yüzey Alanı",
        description: "Tıbbi hesaplamalar için",
        icon: Square,
        color: "text-slate-600",
    },
];

export default function CalculatorPage() {
    const [openSheet, setOpenSheet] = useState<CalculatorType>(null);

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

            {/* Calculator Components */}
            <BMICalculator 
                open={openSheet === "bmi"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <BMRCalculator 
                open={openSheet === "bmr"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <TDEECalculator 
                open={openSheet === "tdee"} 
                onOpenChange={(open) => !open && setOpenSheet(null)}
            />
            <MacrosCalculator 
                open={openSheet === "macros"} 
                onOpenChange={(open) => !open && setOpenSheet(null)}
            />
            <IdealWeightCalculator 
                open={openSheet === "ideal"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <BodyFatCalculator 
                open={openSheet === "bodyfat"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <WaterIntakeCalculator 
                open={openSheet === "water"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <ProteinNeedsCalculator 
                open={openSheet === "protein"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <CalorieDeficitCalculator 
                open={openSheet === "caloriedeficit"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <WHRCalculator 
                open={openSheet === "whr"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <WHtRCalculator 
                open={openSheet === "whtr"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <LMBCalculator 
                open={openSheet === "lbm"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <FFMICalculator 
                open={openSheet === "ffmi"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
            <MetabolicAgeCalculator 
                open={openSheet === "metabolicage"} 
                onOpenChange={(open) => !open && setOpenSheet(null)}
            />
            <BSACalculator 
                open={openSheet === "bsa"} 
                onOpenChange={(open) => !open && setOpenSheet(null)} 
            />
        </div>
    );
}
