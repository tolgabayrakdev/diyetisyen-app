import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { TDEEResult } from "@/types/calculator-types";

interface TDEECalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bmrResult?: { bmr: number } | null;
}

export function TDEECalculator({ open, onOpenChange, bmrResult }: TDEECalculatorProps) {
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [result, setResult] = useState<TDEEResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <Button onClick={calculate} disabled={loading || !bmrResult} className="w-full">
                        {loading ? "Hesaplanıyor..." : "TDEE Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">TDEE Değeri</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.tdee} {result.unit}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.activityLevel}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Çarpan: {result.multiplier}x
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

