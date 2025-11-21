import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    FileText,
    Edit,
    Plus,
    Clock,
    Trash2,
    File,
    Download,
    X,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DietPlanPDFReport } from "@/components/diet-plan-pdf-report";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    start_date: string | null;
    end_date: string | null;
    template_id?: string | null;
    pdf_url?: string | null;
    created_at: string;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    chronic_conditions?: string | null;
    allergies?: string | null;
    medications?: string | null;
}

interface Dietitian {
    first_name: string;
    last_name: string;
}

interface Meal {
    id: string;
    meal_time: string;
    foods: Food[];
    calories: number | null;
    day_of_week: number | null;
    notes: string | null;
    content: string | null;
}

interface Food {
    name: string;
    amount: string;
    calories?: number;
}

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

export default function DietPlanDetailPage() {
    const { id: clientId, planId } = useParams<{ id: string; planId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<DietPlan | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [dietitian, setDietitian] = useState<Dietitian | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
    const [isCreateMethodDialogOpen, setIsCreateMethodDialogOpen] = useState(false);
    const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
    const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [isDeletingPdf, setIsDeletingPdf] = useState(false);
    const [isDeletingPlan, setIsDeletingPlan] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [isDeletingMeal, setIsDeletingMeal] = useState<string | null>(null);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        content: "",
        start_date: "",
        end_date: "",
    });
    const [contentData, setContentData] = useState("");
    const [mealFormData, setMealFormData] = useState({
        meal_time: "",
        foods: [{ name: "", amount: "", calories: "" }] as Array<{ name: string; amount: string; calories: string }>,
        calories: "",
        day_of_week: "all",
        notes: "",
    });

    useEffect(() => {
        if (clientId && planId) {
            fetchClient();
            fetchDietPlan();
            fetchDietitian();
            fetchMeals();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId, planId]);

    const fetchClient = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${clientId}`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setClient(data.client);
                }
            }
        } catch (error) {
            console.error("Client fetch error:", error);
        }
    };

    const fetchDietPlan = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Plan yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setPlan(data.dietPlan);
                setContentData(data.dietPlan.content || "");
                setEditFormData({
                    title: data.dietPlan.title || "",
                    description: data.dietPlan.description || "",
                    content: data.dietPlan.content || "",
                    start_date: data.dietPlan.start_date || "",
                    end_date: data.dietPlan.end_date || "",
                });
            }
        } catch {
            toast.error("Plan yüklenirken bir hata oluştu");
            navigate(`/clients/${clientId}/diet-plans`);
        } finally {
            setLoading(false);
        }
    };

    const fetchDietitian = async () => {
        try {
            const response = await fetch(apiUrl("api/auth/me"), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    setDietitian({
                        first_name: data.user.first_name || "",
                        last_name: data.user.last_name || "",
                    });
                }
            }
        } catch (error) {
            console.error("Dietitian fetch error:", error);
        }
    };

    const fetchMeals = async () => {
        if (!planId) return;
        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}/meals`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setMeals(data.meals || []);
                }
            }
        } catch (error) {
            console.error("Meals fetch error:", error);
        }
    };

    const handleEdit = () => {
        if (plan) {
            setEditFormData({
                title: plan.title || "",
                description: plan.description || "",
                content: "",
                start_date: "",
                end_date: "",
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleCreateContent = () => {
        setIsCreateMethodDialogOpen(true);
    };

    const handleSelectCreateMethod = (method: "text" | "pdf") => {
        setIsCreateMethodDialogOpen(false);
        if (method === "text") {
            setContentData(plan?.content || "");
            setIsContentDialogOpen(true);
        } else if (method === "pdf") {
            setPdfFile(null);
            setIsPdfDialogOpen(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Lütfen sadece PDF dosyası yükleyin");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error("PDF dosyası 10MB'dan büyük olamaz");
                return;
            }
            setPdfFile(file);
        }
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUploadPdf = async () => {
        if (!pdfFile) {
            toast.error("Lütfen bir PDF dosyası seçin");
            return;
        }

        setIsUploadingPdf(true);
        try {
            // PDF'i base64'e çevir
            const pdfBase64 = await fileToBase64(pdfFile);

            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    pdf_base64: pdfBase64,
                    pdf_file_name: pdfFile.name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "PDF yüklenemedi");
            }

            toast.success("PDF başarıyla yüklendi");
            setIsPdfDialogOpen(false);
            setPdfFile(null);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsUploadingPdf(false);
        }
    };

    const handleDeletePdf = async () => {
        if (!confirm("PDF dosyasını silmek istediğinizden emin misiniz?")) {
            return;
        }

        setIsDeletingPdf(true);
        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    pdf_url: null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "PDF silinemedi");
            }

            toast.success("PDF başarıyla silindi");
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsDeletingPdf(false);
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
                ? apiUrl(`api/meals/${editingMeal.id}`)
                : apiUrl(`api/diet-plans/${planId}/meals`);
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
                day_of_week: "all",
                notes: "",
            });
            fetchMeals();
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
            const response = await fetch(apiUrl(`api/meals/${mealId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Öğün silinemedi");
            }

            toast.success("Öğün silindi");
            fetchMeals();
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

    const handleSaveContent = async () => {
        setIsSavingContent(true);

        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
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

            toast.success("Diyet planı içeriği başarıyla kaydedildi");
            setIsContentDialogOpen(false);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsSavingContent(false);
        }
    };

    const handleDeletePlan = async () => {
        if (!confirm("Bu diyet planını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            return;
        }

        setIsDeletingPlan(true);
        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Diyet planı silinemedi");
            }

            toast.success("Diyet planı başarıyla silindi");
            navigate(`/clients/${clientId}/diet-plans`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsDeletingPlan(false);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: editFormData.title,
                    description: editFormData.description || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Plan güncellenemedi");
            }

            toast.success("Plan başarıyla güncellendi");
            setIsEditDialogOpen(false);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
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

    if (!plan) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/clients">Danışanlar</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/clients/${clientId}`}>
                                {client ? `${client.first_name} ${client.last_name}` : "Danışan"}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/clients/${clientId}/diet-plans`}>Diyet Planları</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>{plan.title}</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
                    {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* İçerik yoksa - İçerik oluştur butonu */}
                    {!plan.content && !plan.pdf_url && (
                        <Button onClick={handleCreateContent} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Diyet Planı İçeriği Oluştur
                        </Button>
                    )}
                    
                    
                    {/* PDF raporu sadece metin içeriği varsa göster, PDF içeriği varsa gösterme */}
                    {plan && client && dietitian && plan.content && !plan.pdf_url && (
                        <DietPlanPDFReport plan={plan} client={client} dietitian={dietitian} />
                    )}
                </div>
            </div>

            {/* Plan PDF */}
            {plan.pdf_url && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <File className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Diyet Planı PDF</h2>
                                <p className="text-sm text-muted-foreground">
                                    Planın PDF dosyası
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleDeletePdf}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            disabled={isDeletingPdf}
                        >
                            {isDeletingPdf ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Siliniyor...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    <span>PDF'i Sil</span>
                                </>
                            )}
                        </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <File className="h-6 w-6 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">PDF Dosyası</p>
                                        <p className="text-xs text-muted-foreground">Yüklenmiş PDF dosyası</p>
                                    </div>
                                </div>
                                <a
                                    href={plan.pdf_url.startsWith('http://') || plan.pdf_url.startsWith('https://') ? plan.pdf_url : apiUrl(plan.pdf_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:underline"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>PDF'i Görüntüle/İndir</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Content - Text Editor */}
            {plan.content && (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">Diyet Planı İçeriği (Metin)</h2>
                        <p className="text-sm text-muted-foreground">
                            Planın metin editörü ile oluşturulmuş içeriği
                        </p>
                    </div>
                    <Button onClick={() => handleSelectCreateMethod("text")} variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        İçeriği Düzenle
                    </Button>
                </div>
                
                <Separator />

                <div className="border rounded-lg p-6 space-y-4">
                    <div 
                        className="prose prose-sm sm:prose-base max-w-none line-clamp-6 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: plan.content }}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setContentData(plan.content || "");
                                setIsContentDialogOpen(true);
                            }}
                            className="text-sm hover:underline flex items-center gap-1"
                        >
                            <FileText className="h-4 w-4" />
                            Tamamını Gör
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* Plan Meals - Şimdilik gizli, sadece metin ve PDF kullanılıyor */}
            {false && meals.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">Öğünler</h2>
                            <p className="text-sm text-muted-foreground">
                                Planın öğün listesi ve yiyecek bilgileri
                            </p>
                        </div>
                        <Button onClick={openMealDialog} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Öğün Ekle
                        </Button>
                    </div>
                    
                    <Separator />

                    <div className="space-y-6">
                        {(() => {
                            const mealsByDay = meals.reduce((acc, meal) => {
                                const day = meal.day_of_week !== null ? meal.day_of_week : "all";
                                if (!acc[day]) {
                                    acc[day] = [];
                                }
                                acc[day].push(meal);
                                return acc;
                            }, {} as Record<string | number, Meal[]>);

                            return Object.keys(mealsByDay).map((day) => {
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
                            });
                        })()}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!plan.content && meals.length === 0 && !plan.pdf_url && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Diyet Planı İçeriği</h2>
                            <p className="text-sm text-muted-foreground">
                                Planın detaylı içeriği
                            </p>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="rounded-lg bg-muted/50 p-12 text-center space-y-4">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">Henüz içerik yok</h3>
                        <p className="text-muted-foreground mb-4">
                            Bu plan için henüz içerik eklenmemiş. Metin editörü kullanarak veya PDF yükleyerek içerik oluşturabilirsiniz.
                        </p>
                        <Button onClick={handleCreateContent} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Diyet Planı İçeriği Oluştur
                        </Button>
                    </div>
                    </div>
                )}

            {/* Create Method Selection Dialog */}
            <Dialog open={isCreateMethodDialogOpen} onOpenChange={setIsCreateMethodDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>İçerik Oluşturma Yöntemi Seçin</DialogTitle>
                        <DialogDescription>
                            Diyet planı içeriğini nasıl oluşturmak istersiniz?
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
                            onClick={() => handleSelectCreateMethod("pdf")}
                            className="h-auto p-6 flex flex-col items-center gap-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer text-left w-full"
                        >
                            <File className="h-8 w-8 shrink-0" />
                            <div className="text-center w-full space-y-1">
                                <div className="font-semibold text-base">PDF Yükle</div>
                                <div className="text-sm text-muted-foreground mt-1 break-words px-2">
                                    Hazır PDF dosyası yükleyerek diyet planını paylaşın
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
                        <DialogTitle>Diyet Planı İçeriği</DialogTitle>
                        <DialogDescription>
                            Yeni bir belge oluşturun. Haftanın günlerini, öğünleri ve tüm detayları istediğiniz gibi formatlayabilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden px-6 py-4 min-h-0 flex flex-col">
                        <RichTextEditor
                            content={contentData}
                            onChange={(content) => setContentData(content)}
                            placeholder="Diyet planınızı buraya yazın. Başlık, liste ve formatlamalar ekleyebilirsiniz..."
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

            {/* PDF Upload Dialog */}
            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>PDF Yükle</DialogTitle>
                        <DialogDescription>
                            Diyet planı için PDF dosyası yükleyin. Maksimum dosya boyutu 10MB'dır.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {!pdfFile ? (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <Label htmlFor="pdf-upload" className="cursor-pointer">
                                    <span className="text-sm font-medium text-primary hover:underline">
                                        PDF dosyası seçin
                                    </span>
                                    <input
                                        id="pdf-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </Label>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Sadece PDF dosyaları kabul edilir (maks. 10MB)
                                </p>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <File className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium text-sm">{pdfFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleRemovePdf}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsPdfDialogOpen(false);
                                setPdfFile(null);
                            }}
                            disabled={isUploadingPdf}
                        >
                            İptal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUploadPdf}
                            disabled={!pdfFile || isUploadingPdf}
                        >
                            {isUploadingPdf ? "Yükleniyor..." : "Yükle"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Planı Düzenle</DialogTitle>
                        <DialogDescription>
                            Diyet planının başlık ve açıklamasını düzenleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_title">Başlık *</Label>
                                <input
                                    id="edit_title"
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, title: e.target.value })
                                    }
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Örn: Kilo Verme Planı"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_description">Açıklama</Label>
                                <textarea
                                    id="edit_description"
                                    value={editFormData.description}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                    }
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Plan hakkında kısa açıklama..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSaving}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Meal Dialog */}
            <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
                <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMeal ? "Öğünü Düzenle" : "Yeni Öğün Ekle"}</DialogTitle>
                        <DialogDescription>
                            Plan'a yeni bir öğün ekleyin veya mevcut öğünü düzenleyin
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
        </div>
    );
}
