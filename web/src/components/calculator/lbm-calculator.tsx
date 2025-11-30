import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import { toast } from "sonner";
import type { LBMResult } from "@/types/calculator-types";

interface LMBCalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LMBCalculator({ open, onOpenChange }: LMBCalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [bodyFatPercent, setBodyFatPercent] = useState("");
    const [result, setResult] = useState<LBMResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm || !age || !gender) {
            toast.error("Kilo, boy, yaş ve cinsiyet gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/lbm"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    age: parseInt(age),
                    gender,
                    bodyFatPercent: bodyFatPercent ? parseFloat(bodyFatPercent) : null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Yağsız vücut kütlesi hesaplandı");
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
                        <Users className="h-5 w-5 text-amber-600" />
                        Yağsız Vücut Kütlesi (LBM) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Kas ve yağsız doku kütlenizi hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-lbm">Kilo (kg)</Label>
                            <Input
                                id="weight-lbm"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-lbm">Boy (cm)</Label>
                            <Input
                                id="height-lbm"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age-lbm">Yaş</Label>
                            <Input
                                id="age-lbm"
                                type="number"
                                placeholder="30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-lbm">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-lbm">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyfat-lbm">Vücut Yağ Yüzdesi (%) (Opsiyonel)</Label>
                            <Input
                                id="bodyfat-lbm"
                                type="number"
                                placeholder="20"
                                value={bodyFatPercent}
                                onChange={(e) => setBodyFatPercent(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Boş bırakılırsa Boer formülü kullanılır</p>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "LBM Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Yağsız Vücut Kütlesi</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.lbm} {result.unit}
                                </span>
                            </div>
                            <Separator className="my-3" />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Vücut Yağ Kütlesi</span>
                                    <span className="text-sm font-medium">{result.bodyFatMass} kg</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Vücut Yağ Yüzdesi</span>
                                    <span className="text-sm font-medium">{result.bodyFatPercent}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Toplam Ağırlık</span>
                                    <span className="text-sm font-medium">{result.totalWeight} kg</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">Yöntem: {result.method}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

