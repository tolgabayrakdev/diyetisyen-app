import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Droplets } from "lucide-react";
import { toast } from "sonner";
import type { BodyFatResult } from "@/types/calculator-types";

interface BodyFatCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BodyFatCalculator({ open, onOpenChange }: BodyFatCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [neckCm, setNeckCm] = useState("");
    const [waistCm, setWaistCm] = useState("");
    const [hipCm, setHipCm] = useState("");
    const [result, setResult] = useState<BodyFatResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm || !age || !gender || !neckCm || !waistCm) {
            toast.error("Tüm gerekli değerler girilmelidir");
            return;
        }

        if ((gender === "kadın" || gender === "female" || gender === "f") && !hipCm) {
            toast.error("Kadınlar için kalça ölçüsü gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/body-fat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    neckCm: parseFloat(neckCm),
                    waistCm: parseFloat(waistCm),
                    hipCm: hipCm ? parseFloat(hipCm) : null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Vücut yağ yüzdesi hesaplandı");
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
                        <Droplets className="h-5 w-5 text-cyan-600" />
                        Vücut Yağ Yüzdesi Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Navy Method ile vücut yağ yüzdenizi hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-bodyfat">Kilo (kg)</Label>
                            <Input
                                id="weight-bodyfat"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-bodyfat">Boy (cm)</Label>
                            <Input
                                id="height-bodyfat"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age-bodyfat">Yaş</Label>
                            <Input
                                id="age-bodyfat"
                                type="number"
                                placeholder="30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-bodyfat">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-bodyfat">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="neck-bodyfat">Boyun Çevresi (cm)</Label>
                            <Input
                                id="neck-bodyfat"
                                type="number"
                                placeholder="38"
                                value={neckCm}
                                onChange={(e) => setNeckCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waist-bodyfat">Bel Çevresi (cm)</Label>
                            <Input
                                id="waist-bodyfat"
                                type="number"
                                placeholder="85"
                                value={waistCm}
                                onChange={(e) => setWaistCm(e.target.value)}
                            />
                        </div>
                        {(gender === "kadın" || gender === "female" || gender === "f") && (
                            <div className="space-y-2">
                                <Label htmlFor="hip-bodyfat">Kalça Çevresi (cm) *</Label>
                                <Input
                                    id="hip-bodyfat"
                                    type="number"
                                    placeholder="95"
                                    value={hipCm}
                                    onChange={(e) => setHipCm(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">* Kadınlar için zorunlu</p>
                            </div>
                        )}
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "Vücut Yağ Yüzdesi Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Vücut Yağ Yüzdesi</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.bodyFatPercent} {result.unit}
                                </span>
                            </div>
                            <Badge variant="outline" className="mb-2">
                                {result.category}
                            </Badge>
                            <p className="text-xs text-muted-foreground">Yöntem: {result.method}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

