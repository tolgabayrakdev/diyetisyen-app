import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Target } from "lucide-react";
import { toast } from "sonner";
import type { IdealWeightResult } from "@/types/calculator-types";

interface IdealWeightCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IdealWeightCalculator({ open, onOpenChange }: IdealWeightCalculatorProps) {
    const [heightCm, setHeightCm] = useState("");
    const [gender, setGender] = useState<string>("");
    const [formula, setFormula] = useState("robinson");
    const [result, setResult] = useState<IdealWeightResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!heightCm || !gender) {
            toast.error("Boy ve cinsiyet gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/ideal-weight"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    heightCm: parseFloat(heightCm),
                    gender,
                    formula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("İdeal kilo hesaplandı");
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
                        <Target className="h-5 w-5 text-pink-600" />
                        İdeal Kilo Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height-ideal">Boy (cm)</Label>
                            <Input
                                id="height-ideal"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-ideal">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-ideal">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formula-ideal">Formül</Label>
                            <Select value={formula} onValueChange={setFormula}>
                                <SelectTrigger id="formula-ideal">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="robinson">Robinson (Önerilen)</SelectItem>
                                    <SelectItem value="miller">Miller</SelectItem>
                                    <SelectItem value="devine">Devine</SelectItem>
                                    <SelectItem value="hamwi">Hamwi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "İdeal Kilo Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">İdeal Kilo</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.idealWeightKg} {result.unit}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Formül: {result.formula}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

