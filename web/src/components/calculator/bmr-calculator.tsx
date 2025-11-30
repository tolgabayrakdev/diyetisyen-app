import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Activity } from "lucide-react";
import { toast } from "sonner";
import type { BMRResult } from "@/types/calculator-types";

interface BMRCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BMRCalculator({ open, onOpenChange }: BMRCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [formula, setFormula] = useState("mifflin");
    const [result, setResult] = useState<BMRResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm || !age || !gender) {
            toast.error("Tüm değerler gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/bmr"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    formula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("BMR hesaplandı");
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
                        <Activity className="h-5 w-5 text-green-600" />
                        BMR (Bazal Metabolizma Hızı) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Vücudunuzun dinlenme halinde harcadığı minimum kalori miktarını hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-bmr">Kilo (kg)</Label>
                            <Input
                                id="weight-bmr"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-bmr">Boy (cm)</Label>
                            <Input
                                id="height-bmr"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age-bmr">Yaş</Label>
                            <Input
                                id="age-bmr"
                                type="number"
                                placeholder="30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-bmr">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-bmr">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formula-bmr">Formül</Label>
                            <Select value={formula} onValueChange={setFormula}>
                                <SelectTrigger id="formula-bmr">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mifflin">Mifflin-St Jeor (Önerilen)</SelectItem>
                                    <SelectItem value="harris">Harris-Benedict</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "BMR Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">BMR Değeri</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.bmr} {result.unit}
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

