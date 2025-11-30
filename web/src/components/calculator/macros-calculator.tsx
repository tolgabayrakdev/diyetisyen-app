import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Target } from "lucide-react";
import { toast } from "sonner";
import type { MacrosResult } from "@/types/calculator-types";

interface MacrosCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tdeeResult?: { tdee: number } | null;
}

export function MacrosCalculator({ open, onOpenChange, tdeeResult }: MacrosCalculatorProps) {
    const [totalCalories, setTotalCalories] = useState("");
    const [proteinPercent, setProteinPercent] = useState("30");
    const [carbPercent, setCarbPercent] = useState("40");
    const [fatPercent, setFatPercent] = useState("30");
    const [result, setResult] = useState<MacrosResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Makro Besinleri Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 space-y-4">
                            <div className="p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium">Toplam Kalori</span>
                                    <span className="text-xl font-bold">{result.totalCalories} kcal</span>
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium">Protein</span>
                                            <p className="text-xs text-muted-foreground">{result.protein.percent}%</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{result.protein.grams}g</span>
                                            <p className="text-xs text-muted-foreground">{result.protein.calories} kcal</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium">Karbonhidrat</span>
                                            <p className="text-xs text-muted-foreground">{result.carbohydrates.percent}%</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{result.carbohydrates.grams}g</span>
                                            <p className="text-xs text-muted-foreground">{result.carbohydrates.calories} kcal</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium">Yağ</span>
                                            <p className="text-xs text-muted-foreground">{result.fat.percent}%</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{result.fat.grams}g</span>
                                            <p className="text-xs text-muted-foreground">{result.fat.calories} kcal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

