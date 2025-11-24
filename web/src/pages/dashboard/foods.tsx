import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Search, Loader2, Plus, Edit, Trash2, Save, ChevronLeft, ChevronRight, Eye, Info, ChevronDown, ChevronUp, Calculator, X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

interface FoodCategory {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    sort_order: number;
    food_count: number;
}

interface FoodNutrients {
    energy_kcal?: number | null;
    energy_kj?: number | null;
    protein_g?: number | null;
    carbohydrates_g?: number | null;
    fat_g?: number | null;
    saturated_fat_g?: number | null;
    trans_fat_g?: number | null;
    fiber_g?: number | null;
    sugar_g?: number | null;
    sodium_mg?: number | null;
    salt_g?: number | null;
    potassium_mg?: number | null;
    calcium_mg?: number | null;
    iron_mg?: number | null;
    magnesium_mg?: number | null;
    phosphorus_mg?: number | null;
    zinc_mg?: number | null;
    vitamin_a_mcg?: number | null;
    vitamin_c_mg?: number | null;
    vitamin_d_mcg?: number | null;
    vitamin_e_mg?: number | null;
    vitamin_k_mcg?: number | null;
    thiamin_mg?: number | null;
    riboflavin_mg?: number | null;
    niacin_mg?: number | null;
    vitamin_b6_mg?: number | null;
    folate_mcg?: number | null;
    vitamin_b12_mcg?: number | null;
    biotin_mcg?: number | null;
    pantothenic_acid_mg?: number | null;
    cholesterol_mg?: number | null;
    caffeine_mg?: number | null;
}

interface Food {
    id: string;
    category_id: string | null;
    name: string;
    description: string | null;
    unit: string;
    image_url: string | null;
    is_active: boolean;
    category_name?: string | null;
    category_icon?: string | null;
    category_color?: string | null;
    nutrients?: FoodNutrients | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Renk seçenekleri
const AVAILABLE_COLORS = [
    { name: "Mavi", value: "text-blue-600", bg: "bg-blue-600" },
    { name: "Yeşil", value: "text-green-600", bg: "bg-green-600" },
    { name: "Kırmızı", value: "text-red-600", bg: "bg-red-600" },
    { name: "Turuncu", value: "text-orange-600", bg: "bg-orange-600" },
    { name: "Mor", value: "text-purple-600", bg: "bg-purple-600" },
    { name: "Pembe", value: "text-pink-600", bg: "bg-pink-600" },
    { name: "Cyan", value: "text-cyan-600", bg: "bg-cyan-600" },
    { name: "Sarı", value: "text-yellow-600", bg: "bg-yellow-600" },
    { name: "İndigo", value: "text-indigo-600", bg: "bg-indigo-600" },
    { name: "Gri", value: "text-gray-600", bg: "bg-gray-600" },
];

// Renk değerini text- formatından bg- formatına çevir
const getBackgroundColor = (colorValue: string | null): string => {
    if (!colorValue) return "bg-primary";

    // Eğer zaten bg- formatındaysa direkt döndür
    if (colorValue.startsWith("bg-")) {
        return colorValue;
    }

    // text- formatındaysa bg- formatına çevir
    if (colorValue.startsWith("text-")) {
        return colorValue.replace("text-", "bg-");
    }

    // AVAILABLE_COLORS'dan bul
    const color = AVAILABLE_COLORS.find(c => c.value === colorValue);
    return color ? color.bg : "bg-primary";
};

// Renk değerini text- formatına çevir (Badge için)
const getTextColor = (colorValue: string | null): string => {
    if (!colorValue) return "text-primary";

    // Eğer zaten text- formatındaysa direkt döndür
    if (colorValue.startsWith("text-")) {
        return colorValue;
    }

    // bg- formatındaysa text- formatına çevir
    if (colorValue.startsWith("bg-")) {
        return colorValue.replace("bg-", "text-");
    }

    // AVAILABLE_COLORS'dan bul
    const color = AVAILABLE_COLORS.find(c => c.bg === colorValue || c.value === colorValue);
    return color ? color.value : "text-primary";
};

export default function FoodSearchPage() {
    const [activeTab, setActiveTab] = useState<"categories" | "foods">("foods");
    const [isInfoExpanded, setIsInfoExpanded] = useState(false);

    // Categories
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<FoodCategory | null>(null);
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        description: "",
        icon: "",
        color: "",
        sort_order: 0
    });

    // Foods
    const [foods, setFoods] = useState<Food[]>([]);
    const [loadingFoods, setLoadingFoods] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [foodPagination, setFoodPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
    const [isFoodDetailOpen, setIsFoodDetailOpen] = useState(false);
    const [viewingFood, setViewingFood] = useState<Food | null>(null);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [foodForm, setFoodForm] = useState({
        category_id: "",
        name: "",
        description: "",
        unit: "",
        image_url: "",
        is_active: true
    });
    const [nutrientsForm, setNutrientsForm] = useState<FoodNutrients>({});
    
    // Food selection for calculation
    const [isSelectionSheetOpen, setIsSelectionSheetOpen] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState<Map<string, { food: Food; quantity: number }>>(new Map());
    
    // Helper function to parse unit and get multiplier
    const parseQuantity = (unit: string, quantity: number): number => {
        // Extract number from unit (e.g., "100g" -> 100, "1 adet" -> 1)
        const unitMatch = unit.match(/(\d+(?:\.\d+)?)/);
        if (!unitMatch) return 1;
        const unitValue = parseFloat(unitMatch[1]);
        if (unitValue === 0) return 1;
        return quantity / unitValue;
    };
    
    // Calculate totals
    const calculateTotals = () => {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        selectedFoods.forEach(({ food, quantity }) => {
            if (!food.nutrients) return;
            
            const multiplier = parseQuantity(food.unit, quantity);
            
            if (food.nutrients.energy_kcal) {
                totalCalories += food.nutrients.energy_kcal * multiplier;
            }
            if (food.nutrients.protein_g) {
                totalProtein += food.nutrients.protein_g * multiplier;
            }
            if (food.nutrients.carbohydrates_g) {
                totalCarbs += food.nutrients.carbohydrates_g * multiplier;
            }
            if (food.nutrients.fat_g) {
                totalFat += food.nutrients.fat_g * multiplier;
            }
        });
        
        return {
            calories: Math.round(totalCalories * 100) / 100,
            protein: Math.round(totalProtein * 100) / 100,
            carbs: Math.round(totalCarbs * 100) / 100,
            fat: Math.round(totalFat * 100) / 100
        };
    };
    
    const totals = calculateTotals();

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Load foods when filters change
    useEffect(() => {
        loadFoods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategoryId, searchQuery, foodPagination.page]);

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await fetch(apiUrl("api/foods/categories"), {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                toast.error(data.message || "Kategoriler yüklenemedi");
            }
        } catch (error) {
            toast.error("Kategoriler yüklenirken bir hata oluştu");
            console.error(error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadFoods = async () => {
        setLoadingFoods(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategoryId) params.append("category_id", selectedCategoryId);
            if (searchQuery) params.append("search", searchQuery);
            params.append("page", foodPagination.page.toString());
            params.append("limit", foodPagination.limit.toString());

            const response = await fetch(apiUrl(`api/foods?${params.toString()}`), {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                setFoods(data.foods);
                if (data.pagination) {
                    setFoodPagination(data.pagination);
                }
            } else {
                toast.error(data.message || "Besinler yüklenemedi");
            }
        } catch (error) {
            toast.error("Besinler yüklenirken bir hata oluştu");
            console.error(error);
        } finally {
            setLoadingFoods(false);
        }
    };

    // Category handlers
    const openCategoryDialog = (category?: FoodCategory) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                description: category.description || "",
                icon: category.icon || "",
                color: category.color || "",
                sort_order: category.sort_order
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: "",
                description: "",
                icon: "",
                color: "",
                sort_order: 0
            });
        }
        setIsCategoryDialogOpen(true);
    };

    const saveCategory = async () => {
        if (!categoryForm.name.trim()) {
            toast.error("Kategori adı gereklidir");
            return;
        }

        try {
            const url = editingCategory
                ? apiUrl(`api/foods/categories/${editingCategory.id}`)
                : apiUrl("api/foods/categories");

            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(categoryForm),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(editingCategory ? "Kategori güncellendi" : "Kategori oluşturuldu");
                setIsCategoryDialogOpen(false);
                loadCategories();
            } else {
                toast.error(data.message || "Kategori kaydedilemedi");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            const response = await fetch(apiUrl(`api/foods/categories/${categoryId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Kategori silindi");
                loadCategories();
            } else {
                toast.error(data.message || "Kategori silinemedi");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        }
    };

    // Food handlers
    const openFoodDialog = (food?: Food) => {
        if (food) {
            setEditingFood(food);
            setFoodForm({
                category_id: food.category_id || "",
                name: food.name,
                description: food.description || "",
                unit: food.unit,
                image_url: food.image_url || "",
                is_active: food.is_active
            });
            setNutrientsForm(food.nutrients || {});
        } else {
            setEditingFood(null);
            setFoodForm({
                category_id: selectedCategoryId || "",
                name: "",
                description: "",
                unit: "",
                image_url: "",
                is_active: true
            });
            setNutrientsForm({});
        }
        setIsFoodDialogOpen(true);
    };

    const saveFood = async () => {
        if (!foodForm.name.trim()) {
            toast.error("Besin adı gereklidir");
            return;
        }

        if (!foodForm.unit.trim()) {
            toast.error("Birim gereklidir");
            return;
        }

        try {
            const url = editingFood
                ? apiUrl(`api/foods/${editingFood.id}`)
                : apiUrl("api/foods");

            const method = editingFood ? "PUT" : "POST";

            const payload = {
                ...foodForm,
                category_id: foodForm.category_id || null,
                nutrients: nutrientsForm
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(editingFood ? "Besin güncellendi" : "Besin oluşturuldu");
                setIsFoodDialogOpen(false);
                loadFoods();
            } else {
                toast.error(data.message || "Besin kaydedilemedi");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        }
    };

    const deleteFood = async (foodId: string) => {
        if (!confirm("Bu besini silmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            const response = await fetch(apiUrl(`api/foods/${foodId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Besin silindi");
                loadFoods();
            } else {
                toast.error(data.message || "Besin silinemedi");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        }
    };


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Besin Veritabanı</h1>
                </div>
                <p className="text-muted-foreground">
                    Kendi besin veritabanınızı oluşturun ve yönetin
                </p>
            </div>

            {/* Bilgilendirme Kartı */}
            <div className="border rounded-lg bg-muted/30">
                <button
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                    <Info className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold flex-1 text-left">Besin Veritabanı Nedir?</h3>
                    {isInfoExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                </button>
                {isInfoExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Besin Veritabanı, diyetisyenlerin kendi besin koleksiyonlarını oluşturup yönetebilecekleri özel bir sistemdir. 
                            Bu veritabanı sayesinde sık kullandığınız besinlerin besin değerlerini kaydedip, diyet planlarınızda hızlıca kullanabilirsiniz.
                        </p>
                        <div className="space-y-1.5 mt-3">
                            <h4 className="text-sm font-semibold">Faydaları:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Kendi besin kütüphanenizi oluşturun ve kategorilere göre organize edin</li>
                                <li>Her besin için detaylı besin değerlerini (kalori, protein, karbonhidrat, yağ, vitaminler, mineraller) kaydedin</li>
                                <li>Esnek birim sistemi ile besinleri farklı miktarlarda tanımlayın (100g, 1 adet, 100ml, vb.)</li>
                                <li>Diyet planlarınızda hızlıca besin arayıp ekleyin</li>
                                <li>Danışanlarınıza özel besin önerileri hazırlayın</li>
                                <li>Zaman kazanın - tekrar tekrar aynı besin değerlerini aramak zorunda kalmayın</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "categories" | "foods")}>
                <TabsList>
                    <TabsTrigger value="foods">Besinler</TabsTrigger>
                    <TabsTrigger value="categories">Kategoriler</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Kategoriler</h2>
                        <Button onClick={() => openCategoryDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Kategori
                        </Button>
                    </div>

                    {loadingCategories ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground">
                            Henüz kategori eklenmemiş. İlk kategorinizi oluşturun.
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Renk</TableHead>
                                        <TableHead>Kategori Adı</TableHead>
                                        <TableHead>Açıklama</TableHead>
                                        <TableHead>Sıralama</TableHead>
                                        <TableHead>Besin Sayısı</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => {
                                        return (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <div className={`w-4 h-4 rounded-full ${getBackgroundColor(category.color)}`} />
                                                </TableCell>
                                                <TableCell className="font-medium">{category.name}</TableCell>
                                                <TableCell>
                                                    {category.description ? (
                                                        <span className="text-sm text-muted-foreground">{category.description}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{category.sort_order}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{category.food_count}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openCategoryDialog(category)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteCategory(category.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="foods" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <h2 className="text-2xl font-semibold">Besinler</h2>
                        <div className="flex gap-2">
                            <Sheet open={isSelectionSheetOpen} onOpenChange={setIsSelectionSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <Calculator className="h-4 w-4 mr-2" />
                                        Besin Seç ve Hesapla
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Besin Seç ve Toplam Hesapla</SheetTitle>
                                        <SheetDescription>
                                            Besinleri seçip miktarlarını girerek toplam kalori, protein, karbonhidrat ve yağ değerlerini hesaplayın
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4 px-2 sm:px-4">
                                        {/* Search in Sheet */}
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Besin ara..."
                                                className="pl-10"
                                            />
                                        </div>
                                        
                                        {/* Selected Foods List */}
                                        {selectedFoods.size > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold">Seçilen Besinler ({selectedFoods.size})</h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedFoods(new Map())}
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Temizle
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                    {Array.from(selectedFoods.entries()).map(([foodId, { food, quantity }]) => (
                                                        <div key={foodId} className="flex items-center gap-3 p-3 border rounded-lg">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate">{food.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Birim: {food.unit}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <Label htmlFor={`sheet-qty-${foodId}`} className="text-xs whitespace-nowrap">Miktar:</Label>
                                                                <Input
                                                                    id={`sheet-qty-${foodId}`}
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={quantity}
                                                                    onChange={(e) => {
                                                                        const newQty = parseFloat(e.target.value) || 0;
                                                                        const newSelected = new Map(selectedFoods);
                                                                        newSelected.set(foodId, { food, quantity: newQty });
                                                                        setSelectedFoods(newSelected);
                                                                    }}
                                                                    className="w-20"
                                                                />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {food.unit.includes('g') ? 'g' : food.unit.includes('ml') ? 'ml' : 'adet'}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newSelected = new Map(selectedFoods);
                                                                        newSelected.delete(foodId);
                                                                        setSelectedFoods(newSelected);
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Totals in Sheet */}
                                                <div className="border-t pt-4">
                                                    <h4 className="font-semibold mb-3">Toplam Besin Değerleri</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Kalori</div>
                                                            <div className="text-xl font-bold">{totals.calories.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">kcal</div>
                                                        </div>
                                                        <div className="p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Protein</div>
                                                            <div className="text-xl font-bold">{totals.protein.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                        <div className="p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Karbonhidrat</div>
                                                            <div className="text-xl font-bold">{totals.carbs.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                        <div className="p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Yağ</div>
                                                            <div className="text-xl font-bold">{totals.fat.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Foods List in Sheet */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Besinler</h3>
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                                {foods.map((food) => {
                                                    const isSelected = selectedFoods.has(food.id);
                                                    return (
                                                        <div
                                                            key={food.id}
                                                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                                            onClick={() => {
                                                                const newSelected = new Map(selectedFoods);
                                                                if (isSelected) {
                                                                    newSelected.delete(food.id);
                                                                } else {
                                                                    const unitMatch = food.unit.match(/(\d+(?:\.\d+)?)/);
                                                                    const defaultQty = unitMatch ? parseFloat(unitMatch[1]) : 100;
                                                                    newSelected.set(food.id, { food, quantity: defaultQty });
                                                                }
                                                                setSelectedFoods(newSelected);
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    const newSelected = new Map(selectedFoods);
                                                                    if (checked) {
                                                                        const unitMatch = food.unit.match(/(\d+(?:\.\d+)?)/);
                                                                        const defaultQty = unitMatch ? parseFloat(unitMatch[1]) : 100;
                                                                        newSelected.set(food.id, { food, quantity: defaultQty });
                                                                    } else {
                                                                        newSelected.delete(food.id);
                                                                    }
                                                                    setSelectedFoods(newSelected);
                                                                }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium">{food.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {food.category_name && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`text-xs mr-2 ${food.category_color ? `${getTextColor(food.category_color)} border-current ${getBackgroundColor(food.category_color)}/10` : ""}`}
                                                                        >
                                                                            {food.category_name}
                                                                        </Badge>
                                                                    )}
                                                                    {food.unit} • {food.nutrients?.energy_kcal ? `${food.nutrients.energy_kcal} kcal` : "-"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <Button onClick={() => openFoodDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Yeni Besin
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Besin ara..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setFoodPagination({ ...foodPagination, page: 1 });
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={selectedCategoryId || "all"} onValueChange={(v) => {
                            setSelectedCategoryId(v === "all" ? null : v);
                            setFoodPagination({ ...foodPagination, page: 1 });
                        }}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Kategori seç" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {loadingFoods ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : foods.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground">
                            Henüz besin eklenmemiş. İlk besininizi oluşturun.
                        </div>
                    ) : (
                        <>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Besin Adı</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Birim</TableHead>
                                            <TableHead>Kalori</TableHead>
                                            <TableHead>Protein</TableHead>
                                            <TableHead>Karbonhidrat</TableHead>
                                            <TableHead>Yağ</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {foods.map((food) => (
                                            <TableRow 
                                                key={food.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => {
                                                    setViewingFood(food);
                                                    setIsFoodDetailOpen(true);
                                                }}
                                            >
                                                <TableCell className="font-medium">{food.name}</TableCell>
                                                <TableCell>
                                                    {food.category_name ? (
                                                        <Badge
                                                            variant="outline"
                                                            className={food.category_color ? `${getTextColor(food.category_color)} border-current ${getBackgroundColor(food.category_color)}/10` : ""}
                                                        >
                                                            {food.category_name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{food.unit}</TableCell>
                                                <TableCell>
                                                    {food.nutrients?.energy_kcal ? `${food.nutrients.energy_kcal} kcal` : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {food.nutrients?.protein_g ? `${food.nutrients.protein_g}g` : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {food.nutrients?.carbohydrates_g ? `${food.nutrients.carbohydrates_g}g` : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {food.nutrients?.fat_g ? `${food.nutrients.fat_g}g` : "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setViewingFood(food);
                                                                setIsFoodDetailOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openFoodDialog(food)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteFood(food.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {foodPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Toplam {foodPagination.total} besin, Sayfa {foodPagination.page} / {foodPagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFoodPagination({ ...foodPagination, page: foodPagination.page - 1 })}
                                            disabled={foodPagination.page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Önceki
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFoodPagination({ ...foodPagination, page: foodPagination.page + 1 })}
                                            disabled={foodPagination.page >= foodPagination.totalPages}
                                        >
                                            Sonraki
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
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
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                placeholder="Örn: Sebze ve Meyveler"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category-description">Açıklama</Label>
                            <Textarea
                                id="category-description"
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                placeholder="Kategori açıklaması"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category-color">Renk *</Label>
                            <Select
                                value={categoryForm.color || ""}
                                onValueChange={(v) => setCategoryForm({ ...categoryForm, color: v })}
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
                                onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                            İptal
                        </Button>
                        <Button onClick={saveCategory}>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Food Dialog */}
            <Dialog open={isFoodDialogOpen} onOpenChange={setIsFoodDialogOpen}>
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
                                        onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                        placeholder="Örn: Elma"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="food-category">Kategori</Label>
                                    <Select
                                        value={foodForm.category_id || "none"}
                                        onValueChange={(v) => setFoodForm({ ...foodForm, category_id: v === "none" ? "" : v })}
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
                                        onChange={(e) => setFoodForm({ ...foodForm, unit: e.target.value })}
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
                                        onChange={(e) => setFoodForm({ ...foodForm, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="food-description">Açıklama</Label>
                                <Textarea
                                    id="food-description"
                                    value={foodForm.description}
                                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                                    placeholder="Besin açıklaması"
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Nutrients */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">
                                Besin Değerleri ({foodForm.unit || "birim"} için)
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Yukarıda belirttiğiniz birim için besin değerlerini girin
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="energy-kcal">Enerji (kcal)</Label>
                                    <Input
                                        id="energy-kcal"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.energy_kcal || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, energy_kcal: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="protein">Protein (g)</Label>
                                    <Input
                                        id="protein"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.protein_g || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, protein_g: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carbs">Karbonhidrat (g)</Label>
                                    <Input
                                        id="carbs"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.carbohydrates_g || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, carbohydrates_g: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fat">Yağ (g)</Label>
                                    <Input
                                        id="fat"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.fat_g || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, fat_g: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fiber">Lif (g)</Label>
                                    <Input
                                        id="fiber"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.fiber_g || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, fiber_g: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sugar">Şeker (g)</Label>
                                    <Input
                                        id="sugar"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.sugar_g || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, sugar_g: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sodium">Sodyum (mg)</Label>
                                    <Input
                                        id="sodium"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.sodium_mg || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, sodium_mg: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="calcium">Kalsiyum (mg)</Label>
                                    <Input
                                        id="calcium"
                                        type="number"
                                        step="0.01"
                                        value={nutrientsForm.calcium_mg || ""}
                                        onChange={(e) => setNutrientsForm({ ...nutrientsForm, calcium_mg: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFoodDialogOpen(false)}>
                            İptal
                        </Button>
                        <Button onClick={saveFood}>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Food Detail Dialog */}
            <Dialog open={isFoodDetailOpen} onOpenChange={setIsFoodDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Besin Detayları</DialogTitle>
                    </DialogHeader>
                    {viewingFood && (
                        <div className="space-y-6 py-4">
                            {/* Basic Info */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold">{viewingFood.name}</h3>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {viewingFood.category_name && (
                                        <Badge
                                            variant="outline"
                                            className={viewingFood.category_color ? `${getTextColor(viewingFood.category_color)} border-current ${getBackgroundColor(viewingFood.category_color)}/10` : ""}
                                        >
                                            {viewingFood.category_name}
                                        </Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">Birim: {viewingFood.unit}</span>
                                </div>
                                {viewingFood.description && (
                                    <p className="text-sm text-muted-foreground">{viewingFood.description}</p>
                                )}
                            </div>

                            {/* Nutrients */}
                            {viewingFood.nutrients && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Besin Değerleri ({viewingFood.unit} için)</h4>
                                    <div className="space-y-2">
                                        {viewingFood.nutrients.energy_kcal && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Enerji</span>
                                                <span className="font-medium">{viewingFood.nutrients.energy_kcal} kcal</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.protein_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Protein</span>
                                                <span className="font-medium">{viewingFood.nutrients.protein_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.carbohydrates_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Karbonhidrat</span>
                                                <span className="font-medium">{viewingFood.nutrients.carbohydrates_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.fat_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Yağ</span>
                                                <span className="font-medium">{viewingFood.nutrients.fat_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.saturated_fat_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Doymuş Yağ</span>
                                                <span className="font-medium">{viewingFood.nutrients.saturated_fat_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.fiber_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Lif</span>
                                                <span className="font-medium">{viewingFood.nutrients.fiber_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.sugar_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Şeker</span>
                                                <span className="font-medium">{viewingFood.nutrients.sugar_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.sodium_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Sodyum</span>
                                                <span className="font-medium">{viewingFood.nutrients.sodium_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.salt_g && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Tuz</span>
                                                <span className="font-medium">{viewingFood.nutrients.salt_g} g</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.potassium_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Potasyum</span>
                                                <span className="font-medium">{viewingFood.nutrients.potassium_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.calcium_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Kalsiyum</span>
                                                <span className="font-medium">{viewingFood.nutrients.calcium_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.iron_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Demir</span>
                                                <span className="font-medium">{viewingFood.nutrients.iron_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.magnesium_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Magnezyum</span>
                                                <span className="font-medium">{viewingFood.nutrients.magnesium_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.phosphorus_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Fosfor</span>
                                                <span className="font-medium">{viewingFood.nutrients.phosphorus_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.zinc_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Çinko</span>
                                                <span className="font-medium">{viewingFood.nutrients.zinc_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.vitamin_a_mcg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">A Vitamini</span>
                                                <span className="font-medium">{viewingFood.nutrients.vitamin_a_mcg} mcg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.vitamin_c_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">C Vitamini</span>
                                                <span className="font-medium">{viewingFood.nutrients.vitamin_c_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.vitamin_d_mcg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">D Vitamini</span>
                                                <span className="font-medium">{viewingFood.nutrients.vitamin_d_mcg} mcg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.vitamin_e_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">E Vitamini</span>
                                                <span className="font-medium">{viewingFood.nutrients.vitamin_e_mg} mg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.vitamin_k_mcg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">K Vitamini</span>
                                                <span className="font-medium">{viewingFood.nutrients.vitamin_k_mcg} mcg</span>
                                            </div>
                                        )}
                                        {viewingFood.nutrients.cholesterol_mg && (
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Kolesterol</span>
                                                <span className="font-medium">{viewingFood.nutrients.cholesterol_mg} mg</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!viewingFood.nutrients && (
                                <div className="p-8 text-center text-muted-foreground">
                                    Bu besin için henüz besin değerleri eklenmemiş.
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
