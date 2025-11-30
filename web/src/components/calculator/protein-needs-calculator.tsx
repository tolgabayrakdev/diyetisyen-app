import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Beef } from "lucide-react";
import { toast } from "sonner";
import type { ProteinNeedsResult } from "@/types/calculator-types";

interface ProteinNeedsCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProteinNeedsCalculator({ open, onOpenChange }: ProteinNeedsCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [goal, setGoal] = useState("maintenance");
    const [result, setResult] = useState<ProteinNeedsResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                    goal: goal || 'maintenance',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                            <Select value={goal} onValueChange={setGoal}>
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
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Protein İhtiyacı Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Günlük Protein İhtiyacı</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.proteinGrams} {result.unit}
                                </span>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Protein/kg</span>
                                    <span className="text-sm font-medium">{result.proteinPerKg} g/kg</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kalori</span>
                                    <span className="text-sm font-medium">{result.proteinCalories} kcal</span>
                                </div>
                            </div>
                            <Separator className="my-3" />
                            <div className="space-y-2">
                                <p className="text-xs font-medium">Örnek Gıda Eşdeğerleri:</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Tavuk Göğsü (100g)</span>
                                    <span className="font-medium">{result.examples.chickenBreast100g} porsiyon</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Yumurta</span>
                                    <span className="font-medium">{result.examples.eggs} adet</span>
                                </div>
                            </div>
                            <Separator className="my-3" />
                            <p className="text-xs text-muted-foreground mb-2">
                                Aktivite: {result.activityLevel}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                Hedef: {result.goal}
                            </p>
                            <p className="text-sm mt-3">{result.recommendation}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

