import { Clock, Utensils, Target, Scale, Dumbbell, Salad, Leaf, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MealPlan {
    name: string;
    time: string;
    foods: { name: string; portion: string; calories?: number }[];
    notes: string;
}

interface DietPlanData {
    templateId: string;
    templateName: string;
    duration: number;
    dailyCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    restrictions: string[];
    meals: MealPlan[];
    notes: string;
}

const templateIcons: Record<string, React.ElementType> = {
    "weight-loss": Scale,
    "weight-gain": TrendingUp,
    "healthy-eating": Salad,
    "sports": Dumbbell,
    "vegetarian": Leaf,
    "detox": Sparkles,
};

const templateColors: Record<string, { text: string; bg: string; border: string }> = {
    "weight-loss": { text: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800" },
    "weight-gain": { text: "text-green-600", bg: "bg-green-50 dark:bg-green-950", border: "border-green-200 dark:border-green-800" },
    "healthy-eating": { text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950", border: "border-emerald-200 dark:border-emerald-800" },
    "sports": { text: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950", border: "border-orange-200 dark:border-orange-800" },
    "vegetarian": { text: "text-lime-600", bg: "bg-lime-50 dark:bg-lime-950", border: "border-lime-200 dark:border-lime-800" },
    "detox": { text: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800" },
};

interface DietPlanTemplateViewProps {
    content: string;
    startDate?: string | null;
    endDate?: string | null;
}

export function DietPlanTemplateView({ content, startDate, endDate }: DietPlanTemplateViewProps) {
    let planData: DietPlanData | null = null;
    
    try {
        planData = JSON.parse(content);
    } catch {
        // Content is not JSON, return null to show legacy view
        return null;
    }

    if (!planData || !planData.templateId) {
        return null;
    }

    const TemplateIcon = templateIcons[planData.templateId] || Utensils;
    const colors = templateColors[planData.templateId] || templateColors["healthy-eating"];

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className={cn("rounded-xl border-2 p-6", colors.border, colors.bg)}>
                <div className="flex items-start gap-4">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", colors.bg, "border", colors.border)}>
                        <TemplateIcon className={cn("w-7 h-7", colors.text)} />
                    </div>
                    <div className="flex-1">
                        <div className={cn("text-sm font-medium mb-1", colors.text)}>
                            {planData.templateName} Programı
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{planData.duration} Hafta</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span>{planData.dailyCalories} kcal/gün</span>
                            </div>
                            {startDate && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span>
                                        {new Date(startDate).toLocaleDateString("tr-TR")}
                                        {endDate && ` - ${new Date(endDate).toLocaleDateString("tr-TR")}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-3 rounded-lg bg-background/60">
                        <div className="text-2xl font-bold text-foreground">{planData.macros.protein}%</div>
                        <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/60">
                        <div className="text-2xl font-bold text-foreground">{planData.macros.carbs}%</div>
                        <div className="text-xs text-muted-foreground">Karbonhidrat</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/60">
                        <div className="text-2xl font-bold text-foreground">{planData.macros.fat}%</div>
                        <div className="text-xs text-muted-foreground">Yağ</div>
                    </div>
                </div>

                {/* Restrictions */}
                {planData.restrictions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {planData.restrictions.map((restriction, index) => (
                            <span 
                                key={index}
                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-background/60 text-foreground"
                            >
                                {restriction}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Meals */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Günlük Öğün Planı
                </h3>
                
                <div className="grid gap-3">
                    {planData.meals.map((meal, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                        colors.bg, colors.text
                                    )}>
                                        {index + 1}
                                    </div>
                                    <span className="font-medium">{meal.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {meal.time}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                {meal.foods.length > 0 ? (
                                    <ul className="space-y-2">
                                        {meal.foods.map((food, foodIndex) => (
                                            <li key={foodIndex} className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {food.name}
                                                </span>
                                                {food.portion && (
                                                    <span className="text-muted-foreground">{food.portion}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Bu öğün için henüz besin eklenmemiş
                                    </p>
                                )}
                                
                                {meal.notes && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                            {meal.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {planData.notes && (
                <div className="border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Ek Notlar
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {planData.notes}
                    </p>
                </div>
            )}
        </div>
    );
}

