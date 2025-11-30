import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { WHRResult } from "@/types/calculator-types";
import { getRiskColor, getRiskBadgeVariant } from "./calculator-utils";

interface WHRCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WHRCalculator({ open, onOpenChange }: WHRCalculatorProps) {
    const [waistCm, setWaistCm] = useState("");
    const [hipCm, setHipCm] = useState("");
    const [gender, setGender] = useState<string>("");
    const [result, setResult] = useState<WHRResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!waistCm || !hipCm || !gender) {
            toast.error("Bel çevresi, kalça çevresi ve cinsiyet gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/whr"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    waistCm: parseFloat(waistCm),
                    hipCm: parseFloat(hipCm),
                    gender,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Bel-Kalça oranı hesaplandı");
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
                        <Heart className="h-5 w-5 text-rose-600" />
                        Bel-Kalça Oranı (WHR) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Kardiyovasküler risk değerlendirmesi için bel-kalça oranınızı hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="waist-whr">Bel Çevresi (cm)</Label>
                            <Input
                                id="waist-whr"
                                type="number"
                                placeholder="85"
                                value={waistCm}
                                onChange={(e) => setWaistCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hip-whr">Kalça Çevresi (cm)</Label>
                            <Input
                                id="hip-whr"
                                type="number"
                                placeholder="95"
                                value={hipCm}
                                onChange={(e) => setHipCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-whr">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-whr">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "WHR Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Bel-Kalça Oranı</span>
                                <span className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                                    {result.whr}
                                </span>
                            </div>
                            <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="mb-2">
                                {result.riskCategory}
                            </Badge>
                            <p className="text-sm mt-3">{result.description}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

