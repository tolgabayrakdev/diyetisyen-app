import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Plus,
    ArrowLeft,
    Edit,
    Trash2,
    Users,
    Calendar,
    Flame,
    FileText,
    Clock,
    Download,
    File,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RichTextEditor } from "@/components/rich-text-editor";

interface DietTemplate {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    category: string | null;
    total_calories: number | null;
    duration_days: number | null;
    pdf_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    meals: Meal[];
    assigned_clients?: Client[];
}

interface Meal {
    id: string;
    meal_time: string;
    foods: Food[];
    calories: number | null;
    day_of_week: number | null;
    notes: string | null;
}

interface Food {
    name: string;
    amount: string;
    calories?: number;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    kilo_verme: "Kilo Verme",
    kilo_alma: "Kilo Alma",
    saglikli_beslenme: "Sağlıklı Beslenme",
    sporcu_beslenmesi: "Sporcu Beslenmesi",
    diyabet: "Diyabet",
    vegan: "Vegan",
    ketojenik: "Ketojenik",
};

const MEAL_TIME_LABELS: Record<string, string> = {
    kahvalti: "Kahvaltı",
    ogle_yemegi: "Öğle Yemeği",
    aksam_yemegi: "Akşam Yemeği",
    atistirma: "Atıştırmalık",
    aksam_atistirma: "Akşam Atıştırmalığı",
};

const DAY_LABELS: Record<number, string> = {
    0: "Pazar",
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi",
};

export default function DietTemplateDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<DietTemplate | null>(null);
    const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isCreateMethodDialogOpen, setIsCreateMethodDialogOpen] = useState(false);
    const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [isDeletingMeal, setIsDeletingMeal] = useState<string | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [contentData, setContentData] = useState("");

    const [mealFormData, setMealFormData] = useState({
        meal_time: "",
        foods: [{ name: "", amount: "", calories: "" }] as Array<{ name: string; amount: string; calories: string }>,
        calories: "",
        day_of_week: "all",
        notes: "",
    });

    useEffect(() => {
        if (id) {
            fetchTemplate();
            fetchClients();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        // Dialog açıldığında, atanmış danışanları seçili olarak işaretle
        if (isAssignDialogOpen && template?.assigned_clients) {
            const assignedIds = template.assigned_clients.map(client => client.id);
            setSelectedClientIds(assignedIds);
        }
    }, [isAssignDialogOpen, template]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl(`api/diet-templates/${id}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Şablon yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setTemplate(data.template);
                setContentData(data.template.content || "");
            }
        } catch {
            toast.error("Şablon yüklenirken bir hata oluştu");
            navigate("/diet-templates");
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await fetch(apiUrl("api/clients?limit=1000"), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setClients(data.clients || []);
                }
            }
        } catch (error) {
            console.error("Clients fetch error:", error);
        }
    };

    const handleAddFood = () => {
        setMealFormData({
            ...mealFormData,
            foods: [...mealFormData.foods, { name: "", amount: "", calories: "" }],
        });
    };

    const handleRemoveFood = (index: number) => {
        const newFoods = mealFormData.foods.filter((_, i) => i !== index);
        setMealFormData({ ...mealFormData, foods: newFoods });
    };

    const handleFoodChange = (index: number, field: string, value: string) => {
        const newFoods = [...mealFormData.foods];
        newFoods[index] = { ...newFoods[index], [field]: value };
        setMealFormData({ ...mealFormData, foods: newFoods });
    };

    const calculateTotalCalories = () => {
        const foodCalories = mealFormData.foods.reduce((sum, food) => {
            return sum + (food.calories ? parseFloat(food.calories) : 0);
        }, 0);
        return foodCalories || mealFormData.calories;
    };

    const handleSaveMeal = async (e: React.FormEvent) => {
        e.preventDefault();

        const foods = mealFormData.foods
            .filter((f) => f.name.trim() !== "")
            .map((f) => ({
                name: f.name,
                amount: f.amount,
                calories: f.calories ? parseFloat(f.calories) : undefined,
            }));

        if (foods.length === 0) {
            toast.error("En az bir yiyecek eklemelisiniz");
            return;
        }

        const totalCalories = calculateTotalCalories();

        try {
            const url = editingMeal
                ? apiUrl(`api/diet-templates/meals/${editingMeal.id}`)
                : apiUrl(`api/diet-templates/${id}/meals`);
            const method = editingMeal ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    meal_time: mealFormData.meal_time,
                    foods,
                    calories: totalCalories ? parseFloat(totalCalories.toString()) : null,
                    day_of_week: mealFormData.day_of_week === "all" || mealFormData.day_of_week === "" 
                        ? null 
                        : parseInt(mealFormData.day_of_week),
                    notes: mealFormData.notes || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Öğün kaydedilemedi");
            }

            toast.success(editingMeal ? "Öğün güncellendi" : "Öğün eklendi");
            setIsMealDialogOpen(false);
            setEditingMeal(null);
            setMealFormData({
                meal_time: "",
                foods: [{ name: "", amount: "", calories: "" }],
                calories: "",
                day_of_week: "",
                notes: "",
            });
            fetchTemplate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        }
    };

    const handleDeleteMeal = async (mealId: string) => {
        if (!confirm("Bu öğünü silmek istediğinizden emin misiniz?")) {
            return;
        }

        setIsDeletingMeal(mealId);
        try {
            const response = await fetch(apiUrl(`api/diet-templates/meals/${mealId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Öğün silinemedi");
            }

            toast.success("Öğün silindi");
            fetchTemplate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsDeletingMeal(null);
        }
    };

    const handleEditMeal = (meal: Meal) => {
        setEditingMeal(meal);
        setMealFormData({
            meal_time: meal.meal_time,
            foods:
                meal.foods && meal.foods.length > 0
                    ? meal.foods.map((f) => ({
                          name: f.name,
                          amount: f.amount,
                          calories: f.calories?.toString() || "",
                      }))
                    : [{ name: "", amount: "", calories: "" }],
            calories: meal.calories?.toString() || "",
            day_of_week: meal.day_of_week !== null && meal.day_of_week !== undefined 
                ? meal.day_of_week.toString() 
                : "all",
            notes: meal.notes || "",
        });
        setIsMealDialogOpen(true);
    };

    const handleAssignToClients = async () => {
        if (selectedClientIds.length === 0) {
            toast.error("En az bir danışan seçmelisiniz");
            return;
        }

        setIsAssigning(true);
        try {
            const response = await fetch(apiUrl(`api/diet-templates/${id}/assign`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    client_ids: selectedClientIds,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Şablon atanamadı");
            }

            toast.success(`${selectedClientIds.length} danışana şablon başarıyla atandı`);
            setIsAssignDialogOpen(false);
            // Şablonu yeniden yükle ki atanmış danışanlar güncellensin
            await fetchTemplate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleCreateContent = () => {
        setIsCreateMethodDialogOpen(true);
    };

    const handleSelectCreateMethod = (method: "text" | "meal") => {
        setIsCreateMethodDialogOpen(false);
        if (method === "text") {
            setContentData(template?.content || "");
            setIsContentDialogOpen(true);
        } else {
            openMealDialog();
        }
    };

    const handleSaveContent = async () => {
        if (!id) return;
        setIsSavingContent(true);

        try {
            const response = await fetch(apiUrl(`api/diet-templates/${id}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    content: contentData || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "İçerik kaydedilemedi");
            }

            toast.success("Diyet şablonu içeriği başarıyla kaydedildi");
            setIsContentDialogOpen(false);
            fetchTemplate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsSavingContent(false);
        }
    };

    const openMealDialog = () => {
        setEditingMeal(null);
        setMealFormData({
            meal_time: "",
            foods: [{ name: "", amount: "", calories: "" }],
            calories: "",
            day_of_week: "all",
            notes: "",
        });
        setIsMealDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (!template) {
        return null;
    }

    // Öğünleri günlere göre grupla
    const mealsByDay = template.meals.reduce((acc, meal) => {
        const day = meal.day_of_week !== null ? meal.day_of_week : "all";
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(meal);
        return acc;
    }, {} as Record<string | number, Meal[]>);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/diet-templates">Diyet Şablonları</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>{template.title}</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/diet-templates")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">{template.title}</h1>
                    </div>
                    {template.description && (
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAssignDialogOpen(true)} disabled={template.meals.length === 0 && !template.content}>
                        <Users className="h-4 w-4 mr-2" />
                        Danışanlara Ata
                    </Button>
                    {!template.content && template.meals.length === 0 && (
                        <Button onClick={handleCreateContent}>
                            <Plus className="h-4 w-4 mr-2" />
                            İçerik Oluştur
                        </Button>
                    )}
                    {(template.content || template.meals.length > 0) && (
                        <>
                            {!template.content && (
                                <Button onClick={() => handleSelectCreateMethod("text")} variant="outline">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Metin Editörü Ekle
                                </Button>
                            )}
                            {template.meals.length === 0 && (
                                <Button onClick={openMealDialog} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Öğün Ekle
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Template Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Şablon Bilgileri</h2>
                        <p className="text-sm text-muted-foreground">
                            Şablonun genel bilgileri ve özellikleri
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {template.category && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Kategori</Label>
                            <div>
                                <Badge variant="secondary">{CATEGORY_LABELS[template.category] || template.category}</Badge>
                            </div>
                        </div>
                    )}
                    {template.total_calories && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Flame className="h-4 w-4 text-muted-foreground" />
                                Günlük Toplam Kalori
                            </Label>
                            <p className="text-base">{template.total_calories} kcal</p>
                        </div>
                    )}
                    {template.duration_days && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Süre
                            </Label>
                            <p className="text-base">{template.duration_days} gün</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Toplam Öğün
                        </Label>
                        <p className="text-base">{template.meals.length} öğün</p>
                    </div>
                    {template.assigned_clients && template.assigned_clients.length > 0 && (
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                Atanan Danışanlar
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {template.assigned_clients.map((client) => (
                                    <Badge key={client.id} variant="secondary">
                                        {client.first_name} {client.last_name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {template.pdf_url && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                PDF Dosyası
                            </Label>
                            <div>
                                <a
                                    href={template.pdf_url.startsWith('http://') || template.pdf_url.startsWith('https://') ? template.pdf_url : apiUrl(template.pdf_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>PDF'i Görüntüle/İndir</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Template Content - Text Editor */}
            {template.content && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">Şablon İçeriği (Metin)</h2>
                            <p className="text-sm text-muted-foreground">
                                Şablonun metin editörü ile oluşturulmuş içeriği
                            </p>
                        </div>
                        <Button onClick={() => handleSelectCreateMethod("text")} variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            İçeriği Düzenle
                        </Button>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <div className="border rounded-lg p-6 bg-card">
                            <div 
                                className="prose prose-sm sm:prose-base max-w-none"
                                dangerouslySetInnerHTML={{ __html: template.content }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Meals Section */}
            {template.meals.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">Öğünler</h2>
                            <p className="text-sm text-muted-foreground">
                                Şablonun öğün listesi ve yiyecek bilgileri
                            </p>
                        </div>
                        <Button onClick={openMealDialog} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Öğün Ekle
                        </Button>
                    </div>
                    
                    <Separator />

                    {template.meals.length === 0 ? null : (
                    <div className="space-y-6">
                        {/* Her gün için öğünler */}
                        {Object.keys(mealsByDay).map((day) => {
                            const dayNum = day === "all" ? null : parseInt(day);
                            const dayMeals = mealsByDay[day];

                            return (
                                <div key={day} className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">
                                            {dayNum !== null ? DAY_LABELS[dayNum] : "Tüm Günler"}
                                        </h3>
                                        <Badge variant="outline" className="ml-2">
                                            {dayMeals.length} öğün
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="border rounded-lg">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Öğün</TableHead>
                                                    <TableHead>Yiyecekler</TableHead>
                                                    <TableHead className="text-right">Kalori</TableHead>
                                                    <TableHead className="text-right">İşlemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {dayMeals.map((meal) => (
                                                    <TableRow key={meal.id}>
                                                        <TableCell className="font-medium">
                                                            {MEAL_TIME_LABELS[meal.meal_time] || meal.meal_time}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                {meal.foods && meal.foods.length > 0 ? (
                                                                    meal.foods.map((food, idx) => (
                                                                        <div key={idx} className="text-sm">
                                                                            <span className="font-medium">{food.name}</span>
                                                                            {food.amount && (
                                                                                <span className="text-muted-foreground ml-1">
                                                                                    ({food.amount})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-muted-foreground text-sm">
                                                                        Yiyecek bilgisi yok
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {meal.notes && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {meal.notes}
                                                                </p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {meal.calories ? (
                                                                <Badge variant="outline">{meal.calories} kcal</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditMeal(meal)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteMeal(meal.id)}
                                                                    disabled={isDeletingMeal === meal.id}
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                >
                                                                    {isDeletingMeal === meal.id ? (
                                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            )}

            {/* Empty State */}
            {!template.content && template.meals.length === 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Şablon İçeriği</h2>
                            <p className="text-sm text-muted-foreground">
                                Şablonun detaylı içeriği
                            </p>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="rounded-lg bg-muted/50 p-12 text-center space-y-4">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">Henüz içerik yok</h3>
                        <p className="text-muted-foreground mb-4">
                            Bu şablon için henüz içerik eklenmemiş. Metin editörü kullanarak veya öğün seçerek içerik oluşturabilirsiniz.
                        </p>
                        <Button onClick={handleCreateContent}>
                            <Plus className="h-4 w-4 mr-2" />
                            İçerik Oluştur
                        </Button>
                    </div>
                </div>
            )}

            {/* Create Method Selection Dialog */}
            <Dialog open={isCreateMethodDialogOpen} onOpenChange={setIsCreateMethodDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>İçerik Oluşturma Yöntemi Seçin</DialogTitle>
                        <DialogDescription>
                            Diyet şablonu içeriğini nasıl oluşturmak istersiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <button
                            onClick={() => handleSelectCreateMethod("text")}
                            className="h-auto p-6 flex flex-col items-center gap-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer text-left w-full"
                        >
                            <FileText className="h-8 w-8 shrink-0" />
                            <div className="text-center w-full space-y-1">
                                <div className="font-semibold text-base">Metin Editörü</div>
                                <div className="text-sm text-muted-foreground mt-1 break-words px-2">
                                    Zengin metin editörü ile Word benzeri formatlamalar yapabilirsiniz
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleSelectCreateMethod("meal")}
                            className="h-auto p-6 flex flex-col items-center gap-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer text-left w-full"
                        >
                            <Clock className="h-8 w-8 shrink-0" />
                            <div className="text-center w-full space-y-1">
                                <div className="font-semibold text-base">Öğün Seçimi</div>
                                <div className="text-sm text-muted-foreground mt-1 break-words px-2">
                                    Öğünler ve yiyecekler ekleyerek yapılandırılmış şablon oluşturun
                                </div>
                            </div>
                        </button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateMethodDialogOpen(false)}>
                            İptal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Content Creation/Edit Dialog - Fullscreen */}
            <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogContent 
                    className="max-w-none! w-screen! h-screen! max-h-screen! m-0! p-0! rounded-none overflow-hidden flex flex-col translate-x-0! translate-y-0! top-0! left-0! right-0! bottom-0! inset-0!"
                    showCloseButton={true}
                >
                    <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                        <DialogTitle>Diyet Şablonu İçeriği</DialogTitle>
                        <DialogDescription>
                            Yeni bir belge oluşturun. Haftanın günlerini, öğünleri ve tüm detayları istediğiniz gibi formatlayabilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden px-6 py-4 min-h-0 flex flex-col">
                        <RichTextEditor
                            content={contentData}
                            onChange={(content) => setContentData(content)}
                            placeholder="Diyet şablonunuzu buraya yazın. Başlık, liste ve formatlamalar ekleyebilirsiniz..."
                        />
                    </div>
                    <DialogFooter className="px-6 pb-6 pt-4 border-t shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsContentDialogOpen(false)}
                            disabled={isSavingContent}
                        >
                            İptal
                        </Button>
                        <Button onClick={handleSaveContent} disabled={isSavingContent}>
                            {isSavingContent ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Meal Dialog */}
            <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
                <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMeal ? "Öğünü Düzenle" : "Yeni Öğün Ekle"}</DialogTitle>
                        <DialogDescription>
                            Şablona yeni bir öğün ekleyin veya mevcut öğünü düzenleyin
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveMeal}>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meal_time">Öğün Zamanı *</Label>
                                    <Select
                                        value={mealFormData.meal_time}
                                        onValueChange={(value) =>
                                            setMealFormData({ ...mealFormData, meal_time: value })
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Öğün seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(MEAL_TIME_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">Gün</Label>
                                    <Select
                                        value={mealFormData.day_of_week}
                                        onValueChange={(value) =>
                                            setMealFormData({ ...mealFormData, day_of_week: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tüm günler" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tüm Günler</SelectItem>
                                            {Object.entries(DAY_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Yiyecekler *</Label>
                                {mealFormData.foods.map((food, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-5">
                                            <Input
                                                placeholder="Yiyecek adı"
                                                value={food.name}
                                                onChange={(e) =>
                                                    handleFoodChange(index, "name", e.target.value)
                                                }
                                                required={index === 0}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                placeholder="Miktar"
                                                value={food.amount}
                                                onChange={(e) =>
                                                    handleFoodChange(index, "amount", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Kalori"
                                                value={food.calories}
                                                onChange={(e) =>
                                                    handleFoodChange(index, "calories", e.target.value)
                                                }
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-span-2 flex gap-1">
                                            {mealFormData.foods.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveFood(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {index === mealFormData.foods.length - 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleAddFood}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="calories">Toplam Kalori (Otomatik hesaplanır)</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    value={calculateTotalCalories() || ""}
                                    onChange={(e) =>
                                        setMealFormData({ ...mealFormData, calories: e.target.value })
                                    }
                                    placeholder="Otomatik hesaplanır"
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notlar</Label>
                                <Textarea
                                    id="notes"
                                    value={mealFormData.notes}
                                    onChange={(e) =>
                                        setMealFormData({ ...mealFormData, notes: e.target.value })
                                    }
                                    placeholder="Özel notlar..."
                                    rows={2}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsMealDialogOpen(false);
                                    setEditingMeal(null);
                                }}
                            >
                                İptal
                            </Button>
                            <Button type="submit">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign to Clients Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Şablonu Danışanlara Ata</DialogTitle>
                        <DialogDescription>
                            Bu şablonu seçtiğiniz danışanlara atayın. Her danışan için ayrı bir diyet planı
                            oluşturulacaktır.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Danışanlar</Label>
                            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                                {clients.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Henüz danışan yok
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {clients.map((client) => {
                                            const isAssigned = template?.assigned_clients?.some(
                                                (ac) => ac.id === client.id
                                            );
                                            return (
                                                <label
                                                    key={client.id}
                                                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedClientIds.includes(client.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedClientIds([...selectedClientIds, client.id]);
                                                            } else {
                                                                setSelectedClientIds(
                                                                    selectedClientIds.filter((id) => id !== client.id)
                                                                );
                                                            }
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm flex items-center gap-2">
                                                        {client.first_name} {client.last_name}
                                                        {isAssigned && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Atanmış
                                                            </Badge>
                                                        )}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {selectedClientIds.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {selectedClientIds.length} danışan seçildi
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                            İptal
                        </Button>
                        <Button onClick={handleAssignToClients} disabled={isAssigning || selectedClientIds.length === 0}>
                            {isAssigning ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    Atanıyor...
                                </>
                            ) : (
                                "Ata"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

