import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { toast } from "sonner";
import type { CalorieDeficitSurplusResult } from "@/types/calculator-types";

interface CalorieDeficitCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CalorieDeficitCalculator({ open, onOpenChange }: CalorieDeficitCalculatorProps) {
    const [currentWeightKg, setCurrentWeightKg] = useState("");
    const [targetWeightKg, setTargetWeightKg] = useState("");
    const [durationWeeks, setDurationWeeks] = useState("");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [result, setResult] = useState<CalorieDeficitSurplusResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Kalori Açığı/Fazlası Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 space-y-4">
                            <div className="p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{result.type}</span>
                                    <Badge variant={result.isSafe ? "default" : "destructive"}>
                                        {result.isSafe ? "Güvenli" : "Dikkat"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{result.description}</p>
                                <Separator className="my-3" />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Günlük Kalori Farkı</span>
                                        <span className={`text-lg font-bold ${result.dailyCalorieDifference > 0 ? 'text-green-600' : result.dailyCalorieDifference < 0 ? 'text-red-600' : 'text-primary'}`}>
                                            {result.dailyCalorieDifference > 0 ? '+' : ''}{result.dailyCalorieDifference} kcal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Önerilen Günlük Kalori</span>
                                        <span className="text-lg font-bold text-primary">
                                            {result.recommendedDailyCalories} kcal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Tahmini TDEE</span>
                                        <span className="text-sm font-medium">
                                            {result.estimatedTDEE} kcal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Haftalık Kilo Değişimi</span>
                                        <span className={`text-sm font-bold ${result.weeklyWeightChange > 0 ? 'text-green-600' : result.weeklyWeightChange < 0 ? 'text-red-600' : 'text-primary'}`}>
                                            {result.weeklyWeightChange > 0 ? '+' : ''}{result.weeklyWeightChange} kg/hafta
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border">
                                <p className="text-xs font-medium mb-2">Özet Bilgiler:</p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>Kilo Farkı: {result.weightDifferenceKg > 0 ? '+' : ''}{result.weightDifferenceKg} kg</p>
                                    <p>Süre: {result.durationWeeks} hafta</p>
                                    <p>Aktivite: {result.activityLevel}</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-lg border ${result.isSafe ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800'}`}>
                                <p className="text-sm font-medium mb-1">
                                    {result.isSafe ? '✓ Güvenli Aralık' : '⚠ Dikkat Gerekli'}
                                </p>
                                <p className="text-xs text-muted-foreground">{result.safetyMessage}</p>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

