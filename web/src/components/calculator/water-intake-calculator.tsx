import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { GlassWater } from "lucide-react";
import { toast } from "sonner";
import type { WaterIntakeResult } from "@/types/calculator-types";

interface WaterIntakeCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WaterIntakeCalculator({ open, onOpenChange }: WaterIntakeCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [season, setSeason] = useState("normal");
    const [result, setResult] = useState<WaterIntakeResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Su İhtiyacı Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Günlük Su İhtiyacı</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.waterIntakeL} {result.unit}
                                </span>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Mililitre</span>
                                    <span className="text-sm font-medium">{result.waterIntakeMl} ml</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Bardak (250ml)</span>
                                    <span className="text-sm font-medium">{result.glasses} bardak</span>
                                </div>
                            </div>
                            <Separator className="my-3" />
                            <p className="text-xs text-muted-foreground mb-2">
                                Aktivite: {result.activityLevel}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                Mevsim: {result.season}
                            </p>
                            <p className="text-sm mt-3">{result.recommendation}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

