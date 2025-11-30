import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";
import { toast } from "sonner";
import type { WHtRResult } from "@/types/calculator-types";
import { getRiskColor, getRiskBadgeVariant } from "./calculator-utils";

interface WHtRCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WHtRCalculator({ open, onOpenChange }: WHtRCalculatorProps) {
    const [waistCm, setWaistCm] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [result, setResult] = useState<WHtRResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!waistCm || !heightCm) {
            toast.error("Bel çevresi ve boy gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/whtr"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    waistCm: parseFloat(waistCm),
                    heightCm: parseFloat(heightCm),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Bel-Boy oranı hesaplandı");
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
                        <Ruler className="h-5 w-5 text-teal-600" />
                        Bel-Boy Oranı (WHtR) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        BMI'den daha iyi bir sağlık göstergesi olan bel-boy oranınızı hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="waist-whtr">Bel Çevresi (cm)</Label>
                            <Input
                                id="waist-whtr"
                                type="number"
                                placeholder="85"
                                value={waistCm}
                                onChange={(e) => setWaistCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-whtr">Boy (cm)</Label>
                            <Input
                                id="height-whtr"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "WHtR Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Bel-Boy Oranı</span>
                                <span className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                                    {result.whtr}
                                </span>
                            </div>
                            <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="mb-2">
                                {result.category}
                            </Badge>
                            <p className="text-sm mt-3">{result.description}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

