import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import type { MetabolicAgeResult } from "@/types/calculator-types";

interface MetabolicAgeCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bmrResult?: { bmr: number } | null;
}

export function MetabolicAgeCalculator({ open, onOpenChange, bmrResult }: MetabolicAgeCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [formula, setFormula] = useState("mifflin");
    const [result, setResult] = useState<MetabolicAgeResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm || !age || !gender || !bmrResult?.bmr) {
            toast.error("Önce BMR hesaplamanız gerekiyor");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/metabolic-age"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    bmr: bmrResult.bmr,
                    formula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Metabolik yaş hesaplandı");
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
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        Metabolik Yaş Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        BMR'nize göre metabolik yaşınızı hesaplayın ve metabolizma sağlığınızı değerlendirin
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
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-metabolic">Kilo (kg)</Label>
                            <Input
                                id="weight-metabolic"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-metabolic">Boy (cm)</Label>
                            <Input
                                id="height-metabolic"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age-metabolic">Yaş</Label>
                            <Input
                                id="age-metabolic"
                                type="number"
                                placeholder="30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-metabolic">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-metabolic">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formula-metabolic">BMR Formülü</Label>
                            <Select value={formula} onValueChange={setFormula}>
                                <SelectTrigger id="formula-metabolic">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mifflin">Mifflin-St Jeor (Önerilen)</SelectItem>
                                    <SelectItem value="harris">Harris-Benedict</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading || !bmrResult} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Metabolik Yaş Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Metabolik Yaş</span>
                                <span className={`text-2xl font-bold ${result.ageDifference < 0 ? 'text-green-600' : result.ageDifference > 5 ? 'text-red-600' : 'text-primary'}`}>
                                    {result.metabolicAge} {result.unit}
                                </span>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kronolojik Yaş</span>
                                    <span className="text-sm font-medium">{result.chronologicalAge} yaş</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Fark</span>
                                    <span className={`text-sm font-bold ${result.ageDifference < 0 ? 'text-green-600' : result.ageDifference > 5 ? 'text-red-600' : 'text-primary'}`}>
                                        {result.ageDifference > 0 ? '+' : ''}{result.ageDifference} yaş
                                    </span>
                                </div>
                            </div>
                            <Separator className="my-3" />
                            <Badge variant="outline" className="mb-2">
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

