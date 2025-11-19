import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    ArrowLeft,
    Calendar,
    Flame,
    Clock,
    FileText,
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    template_id?: string | null;
    created_at: string;
    meals: Meal[];
}

interface Meal {
    id: string;
    meal_time: string;
    foods: Food[];
    calories: number | null;
    day_of_week: number | null;
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

    useEffect(() => {
        if (clientId && planId) {
            fetchClient();
            fetchDietPlan();
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
            }
        } catch {
            toast.error("Plan yüklenirken bir hata oluştu");
            navigate(`/clients/${clientId}/diet-plans`);
        } finally {
            setLoading(false);
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

    // Öğünleri günlere göre grupla
    const mealsByDay = plan.meals.reduce((acc, meal) => {
        const day = meal.day_of_week !== null ? meal.day_of_week : "all";
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(meal);
        return acc;
    }, {} as Record<string | number, Meal[]>);

    // Toplam kalori hesapla
    const totalCalories = plan.meals.reduce((sum, meal) => {
        return sum + (meal.calories || 0);
    }, 0);

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
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/clients/${clientId}/diet-plans`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
                    </div>
                    {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    )}
                </div>
            </div>

            {/* Plan Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Plan Bilgileri</h2>
                        <p className="text-sm text-muted-foreground">
                            Planın genel bilgileri ve özellikleri
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.start_date && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Başlangıç Tarihi
                            </Label>
                            <p className="text-base">{new Date(plan.start_date).toLocaleDateString("tr-TR")}</p>
                        </div>
                    )}
                    {plan.end_date && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Bitiş Tarihi
                            </Label>
                            <p className="text-base">{new Date(plan.end_date).toLocaleDateString("tr-TR")}</p>
                        </div>
                    )}
                    {totalCalories > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Flame className="h-4 w-4 text-muted-foreground" />
                                Günlük Toplam Kalori
                            </Label>
                            <p className="text-base">{totalCalories} kcal</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Toplam Öğün
                        </Label>
                        <p className="text-base">{plan.meals.length} öğün</p>
                    </div>
                </div>
            </div>

            {/* Meals Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Öğünler</h2>
                        <p className="text-sm text-muted-foreground">
                            Planın öğün listesi ve yiyecek bilgileri
                        </p>
                    </div>
                </div>
                
                <Separator />

                {plan.meals.length === 0 ? (
                    <div className="rounded-lg bg-muted/50 p-12 text-center space-y-4">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">Henüz öğün yok</h3>
                        <p className="text-muted-foreground">
                            Bu planda henüz öğün bulunmuyor
                        </p>
                    </div>
                ) : (
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
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {meal.calories ? (
                                                                <Badge variant="outline">{meal.calories} kcal</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">-</span>
                                                            )}
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
        </div>
    );
}

