import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getBackgroundColor, getTextColor } from "@/lib/food-utils";
import type { Food } from "@/types/food-types";

interface FoodDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    food: Food | null;
}

export function FoodDetailDialog({ open, onOpenChange, food }: FoodDetailDialogProps) {
    if (!food) return null;

    const n = food.nutrients;
    
    // Helper functions to check if section has data
    const hasEnergyData = !!(n?.energy_kcal || n?.energy_kj || n?.protein_g || n?.carbohydrates_g || n?.fat_g || n?.saturated_fat_g || n?.trans_fat_g || n?.fiber_g || n?.sugar_g);
    const hasMineralsData = !!(n?.sodium_mg || n?.salt_g || n?.potassium_mg || n?.calcium_mg || n?.iron_mg || n?.magnesium_mg || n?.phosphorus_mg || n?.zinc_mg);
    const hasVitaminsData = !!(n?.vitamin_a_mcg || n?.vitamin_c_mg || n?.vitamin_d_mcg || n?.vitamin_e_mg || n?.vitamin_k_mcg || n?.thiamin_mg || n?.riboflavin_mg || n?.niacin_mg || n?.vitamin_b6_mg || n?.folate_mcg || n?.vitamin_b12_mcg || n?.biotin_mcg || n?.pantothenic_acid_mg);
    const hasOtherData = !!(n?.cholesterol_mg || n?.caffeine_mg);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Besin Detayları</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{food.name}</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                            {food.category_name && (
                                <Badge
                                    variant="outline"
                                    className={food.category_color ? `${getTextColor(food.category_color)} border-current ${getBackgroundColor(food.category_color)}/10` : ""}
                                >
                                    {food.category_name}
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">Birim: {food.unit}</span>
                        </div>
                        {food.description && (
                            <p className="text-sm text-muted-foreground">{food.description}</p>
                        )}
                    </div>

                    {/* Nutrients */}
                    {food.nutrients && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase">Besin Değerleri ({food.unit} için)</h4>
                            
                            {/* Enerji ve Makro Besinler */}
                            {hasEnergyData && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">Enerji ve Makro Besinler</h5>
                                    {food.nutrients.energy_kcal && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Enerji (kcal)</span>
                                            <span className="font-medium">{food.nutrients.energy_kcal} kcal</span>
                                        </div>
                                    )}
                                    {food.nutrients.energy_kj && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Enerji (kJ)</span>
                                            <span className="font-medium">{food.nutrients.energy_kj} kJ</span>
                                        </div>
                                    )}
                                    {food.nutrients.protein_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Protein</span>
                                            <span className="font-medium">{food.nutrients.protein_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.carbohydrates_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Karbonhidrat</span>
                                            <span className="font-medium">{food.nutrients.carbohydrates_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.fat_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Yağ</span>
                                            <span className="font-medium">{food.nutrients.fat_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.saturated_fat_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Doymuş Yağ</span>
                                            <span className="font-medium">{food.nutrients.saturated_fat_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.trans_fat_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Trans Yağ</span>
                                            <span className="font-medium">{food.nutrients.trans_fat_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.fiber_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Lif</span>
                                            <span className="font-medium">{food.nutrients.fiber_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.sugar_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Şeker</span>
                                            <span className="font-medium">{food.nutrients.sugar_g} g</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mineraller */}
                            {hasMineralsData && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">Mineraller</h5>
                                    {food.nutrients.sodium_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Sodyum</span>
                                            <span className="font-medium">{food.nutrients.sodium_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.salt_g && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Tuz</span>
                                            <span className="font-medium">{food.nutrients.salt_g} g</span>
                                        </div>
                                    )}
                                    {food.nutrients.potassium_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Potasyum</span>
                                            <span className="font-medium">{food.nutrients.potassium_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.calcium_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Kalsiyum</span>
                                            <span className="font-medium">{food.nutrients.calcium_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.iron_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Demir</span>
                                            <span className="font-medium">{food.nutrients.iron_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.magnesium_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Magnezyum</span>
                                            <span className="font-medium">{food.nutrients.magnesium_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.phosphorus_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Fosfor</span>
                                            <span className="font-medium">{food.nutrients.phosphorus_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.zinc_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Çinko</span>
                                            <span className="font-medium">{food.nutrients.zinc_mg} mg</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Vitaminler */}
                            {hasVitaminsData && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">Vitaminler</h5>
                                    {food.nutrients.vitamin_a_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">A Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_a_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_c_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">C Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_c_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_d_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">D Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_d_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_e_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">E Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_e_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_k_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">K Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_k_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.thiamin_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Tiamin (B1)</span>
                                            <span className="font-medium">{food.nutrients.thiamin_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.riboflavin_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Riboflavin (B2)</span>
                                            <span className="font-medium">{food.nutrients.riboflavin_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.niacin_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Niasin (B3)</span>
                                            <span className="font-medium">{food.nutrients.niacin_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_b6_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">B6 Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_b6_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.folate_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Folat (B9)</span>
                                            <span className="font-medium">{food.nutrients.folate_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.vitamin_b12_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">B12 Vitamini</span>
                                            <span className="font-medium">{food.nutrients.vitamin_b12_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.biotin_mcg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Biotin</span>
                                            <span className="font-medium">{food.nutrients.biotin_mcg} mcg</span>
                                        </div>
                                    )}
                                    {food.nutrients.pantothenic_acid_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Pantotenik Asit (B5)</span>
                                            <span className="font-medium">{food.nutrients.pantothenic_acid_mg} mg</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Diğer */}
                            {hasOtherData && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">Diğer</h5>
                                    {food.nutrients.cholesterol_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Kolesterol</span>
                                            <span className="font-medium">{food.nutrients.cholesterol_mg} mg</span>
                                        </div>
                                    )}
                                    {food.nutrients.caffeine_mg && (
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm">Kafein</span>
                                            <span className="font-medium">{food.nutrients.caffeine_mg} mg</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!food.nutrients && (
                        <div className="p-8 text-center text-muted-foreground">
                            Bu besin için henüz besin değerleri eklenmemiş.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

