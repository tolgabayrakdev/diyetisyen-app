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
import { AVAILABLE_COLORS, getBackgroundColor } from "@/lib/food-utils";
import type { FoodCategory } from "@/types/food-types";

type CategoryForm = {
    name: string;
    description: string;
    icon: string;
    color: string;
    sort_order: number;
};

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCategory: FoodCategory | null;
    categoryForm: CategoryForm;
    onFormChange: (form: CategoryForm) => void;
    onSave: () => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    editingCategory,
    categoryForm,
    onFormChange,
    onSave,
}: CategoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
                    </DialogTitle>
                    <DialogDescription>
                        Besin kategorisi bilgilerini girin
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Kategori Adı *</Label>
                        <Input
                            id="category-name"
                            value={categoryForm.name}
                            onChange={(e) => onFormChange({ ...categoryForm, name: e.target.value })}
                            placeholder="Örn: Sebze ve Meyveler"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-description">Açıklama</Label>
                        <Textarea
                            id="category-description"
                            value={categoryForm.description}
                            onChange={(e) => onFormChange({ ...categoryForm, description: e.target.value })}
                            placeholder="Kategori açıklaması"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-color">Renk *</Label>
                        <Select
                            value={categoryForm.color || ""}
                            onValueChange={(v) => onFormChange({ ...categoryForm, color: v })}
                        >
                            <SelectTrigger id="category-color">
                                <SelectValue placeholder="Renk seç" />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABLE_COLORS.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full ${color.bg}`} />
                                            <span>{color.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {categoryForm.color && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className={`w-4 h-4 rounded-full ${getBackgroundColor(categoryForm.color)}`} />
                                <span>Seçili renk: {AVAILABLE_COLORS.find(c => c.value === categoryForm.color)?.name || categoryForm.color}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-sort">Sıralama</Label>
                        <Input
                            id="category-sort"
                            type="number"
                            value={categoryForm.sort_order}
                            onChange={(e) => onFormChange({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
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

