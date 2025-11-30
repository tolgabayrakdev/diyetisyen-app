import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Square } from "lucide-react";
import { toast } from "sonner";
import type { BSAResult } from "@/types/calculator-types";

interface BSACalculatorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BSACalculator({ open, onOpenChange }: BSACalculatorProps) {
    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [formula, setFormula] = useState("dubois");
    const [result, setResult] = useState<BSAResult | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!weightKg || !heightCm) {
            toast.error("Kilo ve boy gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/calculator/bsa"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    weightKg: parseFloat(weightKg),
                    heightCm: parseFloat(heightCm),
                    formula,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data);
                toast.success("Vücut yüzey alanı hesaplandı");
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
                        <Square className="h-5 w-5 text-slate-600" />
                        Vücut Yüzey Alanı (BSA) Hesaplayıcı
                    </SheetTitle>
                    <SheetDescription>
                        Tıbbi hesaplamalar ve ilaç dozajı için vücut yüzey alanınızı hesaplayın
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight-bsa">Kilo (kg)</Label>
                            <Input
                                id="weight-bsa"
                                type="number"
                                placeholder="70"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height-bsa">Boy (cm)</Label>
                            <Input
                                id="height-bsa"
                                type="number"
                                placeholder="175"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formula-bsa">Formül</Label>
                            <Select value={formula} onValueChange={setFormula}>
                                <SelectTrigger id="formula-bsa">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dubois">Du Bois (1916) - Önerilen</SelectItem>
                                    <SelectItem value="mosteller">Mosteller (1987)</SelectItem>
                                    <SelectItem value="haycock">Haycock (1978)</SelectItem>
                                    <SelectItem value="gehan">Gehan & George (1970)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculate} disabled={loading} className="w-full">
                        {loading ? "Hesaplanıyor..." : "BSA Hesapla"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Vücut Yüzey Alanı</span>
                                <span className="text-2xl font-bold text-primary">
                                    {result.bsa} {result.unit}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Formül: {result.formula}</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

