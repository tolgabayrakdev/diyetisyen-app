import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { NutrientForm } from "./nutrient-form";
import type { Food, FoodCategory, FoodNutrients } from "@/types/food-types";

interface FoodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingFood: Food | null;
    foodForm: {
        category_id: string;
        name: string;
        description: string;
        unit: string;
        image_url: string;
        is_active: boolean;
    };
    onFoodFormChange: (form: typeof foodForm) => void;
    nutrientsForm: FoodNutrients;
    onNutrientsChange: (nutrients: FoodNutrients) => void;
    categories: FoodCategory[];
    onSave: () => void;
}

export function FoodDialog({
    open,
    onOpenChange,
    editingFood,
    foodForm,
    onFoodFormChange,
    nutrientsForm,
    onNutrientsChange,
    categories,
    onSave,
}: FoodDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:w-full min-w-0 sm:min-w-[600px] md:min-w-[800px] max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingFood ? "Besin Düzenle" : "Yeni Besin"}
                    </DialogTitle>
                    <DialogDescription>
                        Besin bilgilerini ve besin değerlerini girin
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Temel Bilgiler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="food-name">Besin Adı *</Label>
                                <Input
                                    id="food-name"
                                    value={foodForm.name}
                                    onChange={(e) => onFoodFormChange({ ...foodForm, name: e.target.value })}
                                    placeholder="Örn: Elma"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="food-category">Kategori</Label>
                                <Select
                                    value={foodForm.category_id || "none"}
                                    onValueChange={(v) => onFoodFormChange({ ...foodForm, category_id: v === "none" ? "" : v })}
                                >
                                    <SelectTrigger id="food-category">
                                        <SelectValue placeholder="Kategori seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Kategori Yok</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="food-unit">Birim *</Label>
                                <Input
                                    id="food-unit"
                                    value={foodForm.unit}
                                    onChange={(e) => onFoodFormChange({ ...foodForm, unit: e.target.value })}
                                    placeholder="Örn: 100g, 1 adet, 100ml, 1 adet büyük nohut"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Besin değerlerinin hangi miktar için olduğunu belirtin (örn: 100g, 1 adet, 100ml, 1 porsiyon)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="food-image">Görsel URL</Label>
                                <Input
                                    id="food-image"
                                    value={foodForm.image_url}
                                    onChange={(e) => onFoodFormChange({ ...foodForm, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="food-description">Açıklama</Label>
                            <Textarea
                                id="food-description"
                                value={foodForm.description}
                                onChange={(e) => onFoodFormChange({ ...foodForm, description: e.target.value })}
                                placeholder="Besin açıklaması"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Nutrients */}
                    <NutrientForm
                        nutrients={nutrientsForm}
                        onChange={onNutrientsChange}
                        unit={foodForm.unit}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={onSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

