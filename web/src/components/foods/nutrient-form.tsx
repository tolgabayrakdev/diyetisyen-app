import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FoodNutrients } from "@/types/food-types";

interface NutrientFormProps {
    nutrients: FoodNutrients;
    onChange: (nutrients: FoodNutrients) => void;
    unit: string;
}

export function NutrientForm({ nutrients, onChange, unit }: NutrientFormProps) {
    const [openSections, setOpenSections] = useState({
        energy: true,
        minerals: false,
        vitamins: false,
        other: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updateNutrient = (key: keyof FoodNutrients, value: number | null) => {
        onChange({ ...nutrients, [key]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">
                    Besin Değerleri ({unit || "birim"} için)
                </h3>
                <p className="text-sm text-muted-foreground">
                    Yukarıda belirttiğiniz birim için besin değerlerini girin
                </p>
            </div>

            {/* Enerji ve Makro Besinler */}
            <div className="border rounded-lg">
                <button
                    type="button"
                    onClick={() => toggleSection('energy')}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Enerji ve Makro Besinler</h4>
                    {openSections.energy ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {openSections.energy && (
                    <div className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="energy-kcal">Enerji (kcal)</Label>
                                <Input
                                    id="energy-kcal"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.energy_kcal || ""}
                                    onChange={(e) => updateNutrient('energy_kcal', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="energy-kj">Enerji (kJ)</Label>
                                <Input
                                    id="energy-kj"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.energy_kj || ""}
                                    onChange={(e) => updateNutrient('energy_kj', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="protein">Protein (g)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.protein_g || ""}
                                    onChange={(e) => updateNutrient('protein_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="carbs">Karbonhidrat (g)</Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.carbohydrates_g || ""}
                                    onChange={(e) => updateNutrient('carbohydrates_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fat">Yağ (g)</Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.fat_g || ""}
                                    onChange={(e) => updateNutrient('fat_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="saturated-fat">Doymuş Yağ (g)</Label>
                                <Input
                                    id="saturated-fat"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.saturated_fat_g || ""}
                                    onChange={(e) => updateNutrient('saturated_fat_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trans-fat">Trans Yağ (g)</Label>
                                <Input
                                    id="trans-fat"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.trans_fat_g || ""}
                                    onChange={(e) => updateNutrient('trans_fat_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fiber">Lif (g)</Label>
                                <Input
                                    id="fiber"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.fiber_g || ""}
                                    onChange={(e) => updateNutrient('fiber_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sugar">Şeker (g)</Label>
                                <Input
                                    id="sugar"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.sugar_g || ""}
                                    onChange={(e) => updateNutrient('sugar_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mineraller */}
            <div className="border rounded-lg">
                <button
                    type="button"
                    onClick={() => toggleSection('minerals')}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Mineraller</h4>
                    {openSections.minerals ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {openSections.minerals && (
                    <div className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sodium">Sodyum (mg)</Label>
                                <Input
                                    id="sodium"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.sodium_mg || ""}
                                    onChange={(e) => updateNutrient('sodium_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salt">Tuz (g)</Label>
                                <Input
                                    id="salt"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.salt_g || ""}
                                    onChange={(e) => updateNutrient('salt_g', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="potassium">Potasyum (mg)</Label>
                                <Input
                                    id="potassium"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.potassium_mg || ""}
                                    onChange={(e) => updateNutrient('potassium_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="calcium">Kalsiyum (mg)</Label>
                                <Input
                                    id="calcium"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.calcium_mg || ""}
                                    onChange={(e) => updateNutrient('calcium_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iron">Demir (mg)</Label>
                                <Input
                                    id="iron"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.iron_mg || ""}
                                    onChange={(e) => updateNutrient('iron_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="magnesium">Magnezyum (mg)</Label>
                                <Input
                                    id="magnesium"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.magnesium_mg || ""}
                                    onChange={(e) => updateNutrient('magnesium_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phosphorus">Fosfor (mg)</Label>
                                <Input
                                    id="phosphorus"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.phosphorus_mg || ""}
                                    onChange={(e) => updateNutrient('phosphorus_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zinc">Çinko (mg)</Label>
                                <Input
                                    id="zinc"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.zinc_mg || ""}
                                    onChange={(e) => updateNutrient('zinc_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Vitaminler */}
            <div className="border rounded-lg">
                <button
                    type="button"
                    onClick={() => toggleSection('vitamins')}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Vitaminler</h4>
                    {openSections.vitamins ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {openSections.vitamins && (
                    <div className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-a">A Vitamini (mcg)</Label>
                                <Input
                                    id="vitamin-a"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_a_mcg || ""}
                                    onChange={(e) => updateNutrient('vitamin_a_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-c">C Vitamini (mg)</Label>
                                <Input
                                    id="vitamin-c"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_c_mg || ""}
                                    onChange={(e) => updateNutrient('vitamin_c_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-d">D Vitamini (mcg)</Label>
                                <Input
                                    id="vitamin-d"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_d_mcg || ""}
                                    onChange={(e) => updateNutrient('vitamin_d_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-e">E Vitamini (mg)</Label>
                                <Input
                                    id="vitamin-e"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_e_mg || ""}
                                    onChange={(e) => updateNutrient('vitamin_e_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-k">K Vitamini (mcg)</Label>
                                <Input
                                    id="vitamin-k"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_k_mcg || ""}
                                    onChange={(e) => updateNutrient('vitamin_k_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thiamin">Tiamin - B1 (mg)</Label>
                                <Input
                                    id="thiamin"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.thiamin_mg || ""}
                                    onChange={(e) => updateNutrient('thiamin_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="riboflavin">Riboflavin - B2 (mg)</Label>
                                <Input
                                    id="riboflavin"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.riboflavin_mg || ""}
                                    onChange={(e) => updateNutrient('riboflavin_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="niacin">Niasin - B3 (mg)</Label>
                                <Input
                                    id="niacin"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.niacin_mg || ""}
                                    onChange={(e) => updateNutrient('niacin_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-b6">B6 Vitamini (mg)</Label>
                                <Input
                                    id="vitamin-b6"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_b6_mg || ""}
                                    onChange={(e) => updateNutrient('vitamin_b6_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="folate">Folat - B9 (mcg)</Label>
                                <Input
                                    id="folate"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.folate_mcg || ""}
                                    onChange={(e) => updateNutrient('folate_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vitamin-b12">B12 Vitamini (mcg)</Label>
                                <Input
                                    id="vitamin-b12"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.vitamin_b12_mcg || ""}
                                    onChange={(e) => updateNutrient('vitamin_b12_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="biotin">Biotin (mcg)</Label>
                                <Input
                                    id="biotin"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.biotin_mcg || ""}
                                    onChange={(e) => updateNutrient('biotin_mcg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pantothenic-acid">Pantotenik Asit - B5 (mg)</Label>
                                <Input
                                    id="pantothenic-acid"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.pantothenic_acid_mg || ""}
                                    onChange={(e) => updateNutrient('pantothenic_acid_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Diğer */}
            <div className="border rounded-lg">
                <button
                    type="button"
                    onClick={() => toggleSection('other')}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Diğer</h4>
                    {openSections.other ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {openSections.other && (
                    <div className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cholesterol">Kolesterol (mg)</Label>
                                <Input
                                    id="cholesterol"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.cholesterol_mg || ""}
                                    onChange={(e) => updateNutrient('cholesterol_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="caffeine">Kafein (mg)</Label>
                                <Input
                                    id="caffeine"
                                    type="number"
                                    step="0.01"
                                    value={nutrients.caffeine_mg || ""}
                                    onChange={(e) => updateNutrient('caffeine_mg', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

