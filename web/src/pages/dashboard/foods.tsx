import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Search, Loader2, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye, Info, Calculator, X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { 
    CategoryDialog, 
    FoodDialog, 
    FoodDetailDialog,
} from "@/components/foods";
import type { FoodCategory, Food, FoodNutrients, Pagination } from "@/types/food-types";
import { getBackgroundColor, getTextColor } from "@/lib/food-utils";

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
        <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Besin Veritabanı</h1>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Kendi besin veritabanınızı oluşturun ve yönetin
                </p>
            </div>

            {/* Bilgilendirme Kartı */}
            <div className="border rounded-lg bg-muted/30">
                <button
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                >
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                    <h3 className="font-semibold flex-1 text-left text-sm sm:text-base">Besin Veritabanı Nedir?</h3>
                    {isInfoExpanded ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                    ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                    )}
                </button>
                {isInfoExpanded && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Besin Veritabanı, diyetisyenlerin kendi besin koleksiyonlarını oluşturup yönetebilecekleri özel bir sistemdir. 
                            Bu veritabanı sayesinde sık kullandığınız besinlerin besin değerlerini kaydedip, diyet planlarınızda hızlıca kullanabilirsiniz.
                        </p>
                        <div className="space-y-1.5 mt-2 sm:mt-3">
                            <h4 className="text-xs sm:text-sm font-semibold">Faydaları:</h4>
                            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Kendi besin kütüphanenizi oluşturun ve kategorilere göre organize edin</li>
                                <li>Her besin için detaylı besin değerlerini (kalori, protein, karbonhidrat, yağ, vitaminler, mineraller) kaydedin</li>
                                <li>Esnek birim sistemi ile besinleri farklı miktarlarda tanımlayın (100g, 1 adet, 100ml, vb.)</li>
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

                <TabsContent value="categories" className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                        <h2 className="text-xl sm:text-2xl font-semibold">Kategoriler</h2>
                        <Button onClick={() => openCategoryDialog()} className="w-full sm:w-auto">
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
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block border rounded-lg overflow-x-auto">
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

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="border rounded-lg p-3 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <div className={`w-4 h-4 rounded-full shrink-0 ${getBackgroundColor(category.color)}`} />
                                                <h3 className="font-medium text-sm truncate">{category.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => openCategoryDialog(category)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => deleteCategory(category.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        {category.description && (
                                            <p className="text-xs text-muted-foreground break-words">{category.description}</p>
                                        )}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-xs text-muted-foreground">Sıralama</span>
                                            <span className="text-xs font-medium">{category.sort_order}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">Besin Sayısı</span>
                                            <Badge variant="outline" className="text-xs">{category.food_count}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="foods" className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
                        <h2 className="text-xl sm:text-2xl font-semibold">Besinler</h2>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Sheet open={isSelectionSheetOpen} onOpenChange={setIsSelectionSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <Calculator className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">Besin Seç ve Hesapla</span>
                                        <span className="sm:hidden">Hesapla</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-3 sm:px-6">
                                    <SheetHeader className="px-0">
                                        <SheetTitle className="text-base sm:text-lg">Besin Seç ve Toplam Hesapla</SheetTitle>
                                        <SheetDescription className="text-xs sm:text-sm">
                                            Besinleri seçip miktarlarını girerek toplam kalori, protein, karbonhidrat ve yağ değerlerini hesaplayın
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 px-0">
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
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                    <h3 className="font-semibold text-sm sm:text-base">Seçilen Besinler ({selectedFoods.size})</h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedFoods(new Map())}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Temizle
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                                                    {Array.from(selectedFoods.entries()).map(([foodId, { food, quantity }]) => (
                                                        <div key={foodId} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg">
                                                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                                                                <div className="font-medium text-sm truncate">{food.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Birim: {food.unit}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
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
                                                                    className="w-20 flex-1 sm:flex-none"
                                                                />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {food.unit.includes('g') ? 'g' : food.unit.includes('ml') ? 'ml' : 'adet'}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
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
                                                <div className="border-t pt-3 sm:pt-4">
                                                    <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Toplam Besin Değerleri</h4>
                                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                        <div className="p-2 sm:p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Kalori</div>
                                                            <div className="text-lg sm:text-xl font-bold">{totals.calories.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">kcal</div>
                                                        </div>
                                                        <div className="p-2 sm:p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Protein</div>
                                                            <div className="text-lg sm:text-xl font-bold">{totals.protein.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                        <div className="p-2 sm:p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Karbonhidrat</div>
                                                            <div className="text-lg sm:text-xl font-bold">{totals.carbs.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                        <div className="p-2 sm:p-3 rounded-lg border bg-muted/30">
                                                            <div className="text-xs text-muted-foreground mb-1">Toplam Yağ</div>
                                                            <div className="text-lg sm:text-xl font-bold">{totals.fat.toFixed(1)}</div>
                                                            <div className="text-xs text-muted-foreground">g</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Foods List in Sheet */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-sm sm:text-base">Besinler</h3>
                                            <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                                                {foods.map((food) => {
                                                    const isSelected = selectedFoods.has(food.id);
                                                    return (
                                                        <div
                                                            key={food.id}
                                                            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
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
                                                                className="shrink-0"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm truncate">{food.name}</div>
                                                                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1 mt-0.5">
                                                                    {food.category_name && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`text-xs shrink-0 ${food.category_color ? `${getTextColor(food.category_color)} border-current ${getBackgroundColor(food.category_color)}/10` : ""}`}
                                                                        >
                                                                            {food.category_name}
                                                                        </Badge>
                                                                    )}
                                                                    <span className="truncate">{food.unit} • {food.nutrients?.energy_kcal ? `${food.nutrients.energy_kcal} kcal` : "-"}</span>
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
                            <Button onClick={() => openFoodDialog()} className="w-full sm:w-auto">
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
                            {/* Desktop Table */}
                            <div className="hidden md:block border rounded-lg overflow-x-auto">
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

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-2">
                                {foods.map((food) => (
                                    <div
                                        key={food.id}
                                        className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => {
                                            setViewingFood(food);
                                            setIsFoodDetailOpen(true);
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-sm truncate">{food.name}</h3>
                                                {food.category_name && (
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs mt-1 ${food.category_color ? `${getTextColor(food.category_color)} border-current ${getBackgroundColor(food.category_color)}/10` : ""}`}
                                                    >
                                                        {food.category_name}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => {
                                                        setViewingFood(food);
                                                        setIsFoodDetailOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => openFoodDialog(food)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => deleteFood(food.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                            <div>
                                                <span className="text-xs text-muted-foreground">Birim</span>
                                                <p className="text-xs font-medium">{food.unit}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Kalori</span>
                                                <p className="text-xs font-medium">{food.nutrients?.energy_kcal ? `${food.nutrients.energy_kcal} kcal` : "-"}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Protein</span>
                                                <p className="text-xs font-medium">{food.nutrients?.protein_g ? `${food.nutrients.protein_g}g` : "-"}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Karbonhidrat</span>
                                                <p className="text-xs font-medium">{food.nutrients?.carbohydrates_g ? `${food.nutrients.carbohydrates_g}g` : "-"}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Yağ</span>
                                                <p className="text-xs font-medium">{food.nutrients?.fat_g ? `${food.nutrients.fat_g}g` : "-"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {foodPagination.totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                                    <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                        Toplam {foodPagination.total} besin, Sayfa {foodPagination.page} / {foodPagination.totalPages}
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFoodPagination({ ...foodPagination, page: foodPagination.page - 1 })}
                                            disabled={foodPagination.page === 1}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Önceki
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFoodPagination({ ...foodPagination, page: foodPagination.page + 1 })}
                                            disabled={foodPagination.page >= foodPagination.totalPages}
                                            className="flex-1 sm:flex-none"
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
            {/* Category Dialog */}
            <CategoryDialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
                editingCategory={editingCategory}
                categoryForm={categoryForm}
                onFormChange={setCategoryForm}
                onSave={saveCategory}
            />

            {/* Food Dialog */}
            <FoodDialog
                open={isFoodDialogOpen}
                onOpenChange={setIsFoodDialogOpen}
                editingFood={editingFood}
                foodForm={foodForm}
                onFoodFormChange={setFoodForm}
                nutrientsForm={nutrientsForm}
                onNutrientsChange={setNutrientsForm}
                categories={categories}
                onSave={saveFood}
            />

            {/* Food Detail Dialog */}
            <FoodDetailDialog
                open={isFoodDetailOpen}
                onOpenChange={setIsFoodDetailOpen}
                food={viewingFood}
            />
        </div>
    );
}
