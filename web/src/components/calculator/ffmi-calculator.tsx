import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { toast } from "sonner";
import type { FFMIResult } from "@/types/calculator-types";

interface FFMICalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FFMICalculator({ open, onOpenChange }: FFMICalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<string>("");
    const [bodyFatPercent, setBodyFatPercent] = useState("");
    const [result, setResult] = useState<FFMIResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm || !age || !gender) {
            toast.error("Kilo, boy, yaş ve cinsiyet gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/ffmi"), {
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
                toast.success("Yağsız kütle indeksi hesaplandı");
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
                        <Target className="h-5 w-5 text-violet-600" />
                        Yağsız Kütle İndeksi (FFMI) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Sporcu performans değerlendirmesi için yağsız kütle indeksinizi hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-ffmi">Kilo (kg)</Label>
                            <Input
                                id="weight-ffmi"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-ffmi">Boy (cm)</Label>
                            <Input
                                id="height-ffmi"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age-ffmi">Yaş</Label>
                            <Input
                                id="age-ffmi"
                                type="number"
                                placeholder="30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-ffmi">Cinsiyet</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-ffmi">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="erkek">Erkek</SelectItem>
                                    <SelectItem value="kadın">Kadın</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyfat-ffmi">Vücut Yağ Yüzdesi (%) (Opsiyonel)</Label>
                            <Input
                                id="bodyfat-ffmi"
                                type="number"
                                placeholder="20"
                                value={bodyFatPercent}
                                onChange={(e) => setBodyFatPercent(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Boş bırakılırsa Boer formülü kullanılır</p>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "FFMI Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Normalize FFMI</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.normalizedFFMI}
                                </span>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">FFMI</span>
                                    <span className="text-sm font-medium">{result.ffmi}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Yağsız Vücut Kütlesi</span>
                                    <span className="text-sm font-medium">{result.lbm} kg</span>
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

