import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";
import { toast } from "sonner";
import type { BMIResult } from "@/types/calculator-types";
import { getBMIColor } from "./calculator-utils";

interface BMICalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BMICalculator({ open, onOpenChange }: BMICalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [result, setResult] = useState<BMIResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
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
                setResult(data);
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "BMI Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">BMI Değeri</span>
                                <span className={`text-2xl font-bold ${getBMIColor(result.bmi)}`}>
                                    {result.bmi}
                                </span>
                            </div>
                            <Badge variant="outline" className="mb-2">
                                {result.category}
                            </Badge>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

