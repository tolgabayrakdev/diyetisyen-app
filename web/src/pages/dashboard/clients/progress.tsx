import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, TrendingUp, TrendingDown, Weight, Activity, Minus, BarChart3, ChevronRight, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ProgressPDFReport } from "@/components/progress-pdf-report";

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    height_cm: number | null;
}

interface ProgressLog {
    id: string;
    log_date: string;
    weight_kg: number | null;
    body_fat_percent: number | null;
    muscle_mass_kg: number | null;
    notes: string | null;
    created_at: string;
}

export default function ClientProgressPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | null>(null);
    const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isAllLogsSheetOpen, setIsAllLogsSheetOpen] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingComment, setIsLoadingComment] = useState(false);
    const [isWeightSummaryModalOpen, setIsWeightSummaryModalOpen] = useState(false);
    const [isWeeklyCommentModalOpen, setIsWeeklyCommentModalOpen] = useState(false);
    const [weightSummaryResult, setWeightSummaryResult] = useState<string | null>(null);
    const [weeklyCommentResult, setWeeklyCommentResult] = useState<string | null>(null);
    const [weightSummaryProgress, setWeightSummaryProgress] = useState(0);
    const [weeklyCommentProgress, setWeeklyCommentProgress] = useState(0);
    const [weightSummaryError, setWeightSummaryError] = useState<string | null>(null);
    const [weeklyCommentErrorModal, setWeeklyCommentErrorModal] = useState<string | null>(null);
    const [isWeightSummaryConfirmOpen, setIsWeightSummaryConfirmOpen] = useState(false);
    const [isWeeklyCommentConfirmOpen, setIsWeeklyCommentConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        log_date: new Date().toISOString().split("T")[0],
        weight_kg: "",
        body_fat_percent: "",
        muscle_mass_kg: "",
        notes: "",
    });

    useEffect(() => {
        if (id) {
            fetchClient();
            fetchProgressLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchWeightSummary = async () => {
        if (!id || progressLogs.length < 2) return;
        
        // Önce API çağrısını yap, hata varsa modal açma
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/ai/weight-summary`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Bir hata oluştu" }));
                const errorMessage = errorData.message || `Hata: ${response.status} ${response.statusText}`;
                alert(errorMessage);
                return; // Modal açma, hata mesajını göster ve çık
            }

            const data = await response.json();
            if (!data.success) {
                alert(data.message || "Özet oluşturulamadı");
                return; // Modal açma, hata mesajını göster ve çık
            }

            // Başarılıysa modal aç ve progress göster
            setIsWeightSummaryModalOpen(true);
            setIsLoadingSummary(true);
            setWeightSummaryResult(null);
            setWeightSummaryError(null);
            setWeightSummaryProgress(0);
            
            // Progress bar'ı her saniyede bir artır (5 saniye = 5 adım)
            const progressInterval = setInterval(() => {
                setWeightSummaryProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 20; // Her saniyede %20 artır
                });
            }, 1000);
            
            // Minimum 5 saniye loading gösterimi için
            const startTime = Date.now();
            const minLoadingTime = 5000;
            
            // Kalan süreyi bekle
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            clearInterval(progressInterval);
            setWeightSummaryProgress(100);
            setWeightSummaryResult(data.summary);
            setIsLoadingSummary(false);
        } catch (error) {
            alert("Özet oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            // Modal açma, hata mesajını göster ve çık
        }
    };

    const fetchWeeklyComment = async () => {
        if (!id || progressLogs.length === 0) return;
        
        // Önce API çağrısını yap, hata varsa modal açma
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/ai/weekly-comment`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Bir hata oluştu" }));
                const errorMessage = errorData.message || `Hata: ${response.status} ${response.statusText}`;
                alert(errorMessage);
                return; // Modal açma, hata mesajını göster ve çık
            }

            const data = await response.json();
            if (!data.success) {
                alert(data.message || "Yorum oluşturulamadı");
                return; // Modal açma, hata mesajını göster ve çık
            }

            // Başarılıysa modal aç ve progress göster
            setIsWeeklyCommentModalOpen(true);
            setIsLoadingComment(true);
            setWeeklyCommentErrorModal(null);
            setWeeklyCommentResult(null);
            setWeeklyCommentProgress(0);
            
            // Progress bar'ı her saniyede bir artır (5 saniye = 5 adım)
            const progressInterval = setInterval(() => {
                setWeeklyCommentProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 20; // Her saniyede %20 artır
                });
            }, 1000);
            
            // Minimum 5 saniye loading gösterimi için
            const startTime = Date.now();
            const minLoadingTime = 5000;
            
            // Kalan süreyi bekle
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            clearInterval(progressInterval);
            setWeeklyCommentProgress(100);
            setWeeklyCommentResult(data.comment);
            setWeeklyCommentErrorModal(null);
            setIsLoadingComment(false);
        } catch (error) {
            alert("Yorum oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            // Modal açma, hata mesajını göster ve çık
        }
    };

    const fetchClient = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}`), {
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

    const fetchProgressLogs = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/progress-logs`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setProgressLogs(data.logs || []);
                }
            }
        } catch {
            toast.error("İlerleme kayıtları yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProgressLog = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const response = await fetch(apiUrl(`api/clients/${id}/progress-logs`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    log_date: formData.log_date || new Date().toISOString().split("T")[0],
                    weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                    body_fat_percent: formData.body_fat_percent ? parseFloat(formData.body_fat_percent) : null,
                    muscle_mass_kg: formData.muscle_mass_kg ? parseFloat(formData.muscle_mass_kg) : null,
                    notes: formData.notes || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "İlerleme kaydı oluşturulamadı");
            }

            toast.success("İlerleme kaydı başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                log_date: new Date().toISOString().split("T")[0],
                weight_kg: "",
                body_fat_percent: "",
                muscle_mass_kg: "",
                notes: "",
            });
            fetchProgressLogs();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    // Grafik verilerini hazırla
    const chartData = useMemo(() => {
        const sortedLogs = [...progressLogs].sort(
            (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
        );

        return sortedLogs.map((log) => ({
            date: new Date(log.log_date).toLocaleDateString("tr-TR", {
                month: "short",
                day: "numeric",
            }),
            fullDate: log.log_date,
            weight: log.weight_kg,
            bodyFat: log.body_fat_percent,
            muscleMass: log.muscle_mass_kg,
        }));
    }, [progressLogs]);

    // İstatistikleri hesapla
    const stats = useMemo(() => {
        const weightLogs = progressLogs.filter((log) => log.weight_kg !== null);
        const bodyFatLogs = progressLogs.filter((log) => log.body_fat_percent !== null);
        const muscleMassLogs = progressLogs.filter((log) => log.muscle_mass_kg !== null);

        const calculateStats = (logs: ProgressLog[], field: keyof ProgressLog): {
            first: number;
            last: number;
            avg: number;
            change: number;
            changePercent: string;
            trend: "up" | "down" | "neutral";
        } | null => {
            if (logs.length === 0) return null;

            const values = logs.map((log) => log[field] as number);
            const sorted = [...values].sort((a, b) => a - b);
            const first = sorted[0];
            const last = sorted[sorted.length - 1];
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const change = last - first;
            const changePercent = first !== 0 ? ((change / first) * 100).toFixed(1) : "0";

            return {
                first,
                last,
                avg: Number(avg.toFixed(1)),
                change: Number(change.toFixed(1)),
                changePercent,
                trend: change > 0 ? ("up" as const) : change < 0 ? ("down" as const) : ("neutral" as const),
            };
        };

        return {
            weight: calculateStats(weightLogs, "weight_kg"),
            bodyFat: calculateStats(bodyFatLogs, "body_fat_percent"),
            muscleMass: calculateStats(muscleMassLogs, "muscle_mass_kg"),
        };
    }, [progressLogs]);

    const StatCard = ({
        title,
        value,
        unit,
        change,
        changePercent,
        trend,
        invertTrend = false,
    }: {
        title: string;
        value: number | string;
        unit: string;
        change?: number;
        changePercent?: string;
        trend?: "up" | "down" | "neutral";
        invertTrend?: boolean;
    }) => {
        const effectiveTrend = invertTrend
            ? trend === "up"
                ? "down"
                : trend === "down"
                  ? "up"
                  : "neutral"
            : trend;
        const TrendIcon = effectiveTrend === "up" ? TrendingUp : effectiveTrend === "down" ? TrendingDown : Minus;
        const trendColor =
            effectiveTrend === "up"
                ? "text-red-600 dark:text-red-400"
                : effectiveTrend === "down"
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground";

        return (
            <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold">{value}</span>
                    <span className="text-sm text-muted-foreground">{unit}</span>
                </div>
                {change !== undefined && changePercent && (
                    <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span>
                            {change > 0 ? "+" : ""}
                            {change} ({changePercent}%)
                        </span>
                    </div>
                )}
            </div>
        );
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
                            <Link to={`/clients/${id}`}>
                                {client ? `${client.first_name} ${client.last_name}` : "Danışan"}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>İlerleme Kayıtları</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">İlerleme Kayıtları</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {client && `${client.first_name} ${client.last_name} - `}İlerleme kayıtlarını görüntüleyin
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {progressLogs.length > 0 && client && (
                        <ProgressPDFReport
                            logs={progressLogs}
                            client={client}
                            stats={stats}
                        />
                    )}
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Yeni Kayıt
                    </Button>
                </div>
            </div>

            {/* AI Özetleri */}
            {progressLogs.length >= 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Kilo Değişimi Özeti */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div className="min-w-0">
                                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Kilo Değişimi Özeti</h3>
                                <p className="text-xs text-muted-foreground truncate">AI analiz ile özet oluştur</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsWeightSummaryConfirmOpen(true)}
                            size="sm"
                            variant="outline"
                            disabled={isLoadingSummary}
                            className="gap-1.5 h-8 px-3 shrink-0"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="text-xs">Oluştur</span>
                        </Button>
                    </div>

                    {/* Haftalık İlerleme Yorumu */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                            <div className="min-w-0">
                                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Haftalık İlerleme</h3>
                                <p className="text-xs text-muted-foreground truncate">AI ile haftalık yorum</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsWeeklyCommentConfirmOpen(true)}
                            size="sm"
                            variant="outline"
                            disabled={isLoadingComment}
                            className="gap-1.5 h-8 px-3 shrink-0"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="text-xs">Oluştur</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* İstatistik Kartları */}
            {progressLogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {stats.weight && (
                        <StatCard
                            title="Kilo"
                            value={stats.weight.last}
                            unit="kg"
                            change={stats.weight.change}
                            changePercent={stats.weight.changePercent}
                            trend={stats.weight.trend}
                        />
                    )}
                    {stats.bodyFat && (
                        <StatCard
                            title="Vücut Yağı"
                            value={stats.bodyFat.last}
                            unit="%"
                            change={stats.bodyFat.change}
                            changePercent={stats.bodyFat.changePercent}
                            trend={stats.bodyFat.trend}
                            invertTrend={true}
                        />
                    )}
                    {stats.muscleMass && (
                        <StatCard
                            title="Kas Kütlesi"
                            value={stats.muscleMass.last}
                            unit="kg"
                            change={stats.muscleMass.change}
                            changePercent={stats.muscleMass.changePercent}
                            trend={stats.muscleMass.trend}
                        />
                    )}
                </div>
            )}

            {/* Grafikler Bölümü */}
            {chartData.length > 0 && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Grafikler</h2>
                    </div>
                    <div className="space-y-6">
                        {/* Kilo Grafiği */}
                    {chartData.some((d) => d.weight !== null) && (
                        <div className="border rounded-lg p-2 md:p-4 overflow-x-auto">
                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <Weight className="h-4 w-4 text-primary shrink-0" />
                                <h3 className="font-semibold text-sm md:text-base">Kilo Takibi</h3>
                            </div>
                            <div className="min-w-[600px] md:min-w-0">
                                <ChartContainer
                                    config={{
                                        weight: {
                                            label: "Kilo (kg)",
                                            color: "hsl(217, 91%, 60%)", // Mavi - daha belirgin
                                        },
                                    }}
                                    className="h-[200px] md:h-[250px] w-full"
                                >
                                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="text-[10px] md:text-xs"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="text-[10px] md:text-xs"
                                            domain={["auto", "auto"]}
                                            width={55}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="hsl(217, 91%, 60%)"
                                            strokeWidth={2}
                                            dot={{ r: 3, fill: "hsl(217, 91%, 60%)" }}
                                            activeDot={{ r: 5, fill: "hsl(217, 91%, 60%)" }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </div>
                        </div>
                    )}

                    {/* Vücut Yağı ve Kas Kütlesi Grafiği */}
                    {(chartData.some((d) => d.bodyFat !== null) || chartData.some((d) => d.muscleMass !== null)) && (
                        <div className="border rounded-lg p-2 md:p-4 overflow-x-auto">
                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                                <h3 className="font-semibold text-sm md:text-base">Vücut Kompozisyonu</h3>
                            </div>
                            <div className="min-w-[600px] md:min-w-0">
                                <ChartContainer
                                    config={{
                                        bodyFat: {
                                            label: "Vücut Yağı (%)",
                                            color: "hsl(0, 72%, 51%)", // Kırmızı - vücut yağı için
                                        },
                                        muscleMass: {
                                            label: "Kas Kütlesi (kg)",
                                            color: "hsl(142, 76%, 36%)", // Yeşil - kas için
                                        },
                                    }}
                                    className="h-[200px] md:h-[250px] w-full"
                                >
                                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="text-[10px] md:text-xs"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="text-[10px] md:text-xs"
                                            domain={["auto", "auto"]}
                                            width={55}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        {chartData.some((d) => d.bodyFat !== null) && (
                                            <Line
                                                type="monotone"
                                                dataKey="bodyFat"
                                                stroke="hsl(0, 72%, 51%)"
                                                strokeWidth={2}
                                                dot={{ r: 3, fill: "hsl(0, 72%, 51%)" }}
                                                activeDot={{ r: 5, fill: "hsl(0, 72%, 51%)" }}
                                            />
                                        )}
                                        {chartData.some((d) => d.muscleMass !== null) && (
                                            <Line
                                                type="monotone"
                                                dataKey="muscleMass"
                                                stroke="hsl(142, 76%, 36%)"
                                                strokeWidth={2}
                                                dot={{ r: 3, fill: "hsl(142, 76%, 36%)" }}
                                                activeDot={{ r: 5, fill: "hsl(142, 76%, 36%)" }}
                                            />
                                        )}
                                    </LineChart>
                                </ChartContainer>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            )}

            {/* İlerleme Kayıtları Bölümü */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">İlerleme Kayıtları</h2>
                    {progressLogs.length > 3 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAllLogsSheetOpen(true)}
                            className="gap-2"
                        >
                            Tümünü Gör ({progressLogs.length})
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            {progressLogs.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz ilerleme kaydı yok</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        İlk Kaydı Oluştur
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                        {progressLogs.slice(0, 3).map((log) => {
                            // Önceki kaydı bul (tüm listeden)
                            const currentIndexInFullList = progressLogs.findIndex((l) => l.id === log.id);
                            const previousLog = currentIndexInFullList < progressLogs.length - 1 ? progressLogs[currentIndexInFullList + 1] : null;

                            // Karşılaştırma fonksiyonu
                            const getComparison = (
                                current: number | null,
                                previous: number | null,
                                invert: boolean = false
                            ) => {
                                if (!current || !previous) return null;
                                const diff = current - previous;
                                const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : "0";
                                const isPositive = invert ? diff < 0 : diff > 0;
                                return { diff, percent, isPositive };
                            };

                            const weightComparison = getComparison(log.weight_kg, previousLog?.weight_kg || null);
                            const bodyFatComparison = getComparison(
                                log.body_fat_percent,
                                previousLog?.body_fat_percent || null,
                                true
                            );
                            const muscleMassComparison = getComparison(
                                log.muscle_mass_kg,
                                previousLog?.muscle_mass_kg || null
                            );

                            return (
                        <div key={log.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm">
                                    {new Date(log.log_date).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                                {log.weight_kg && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                        <Weight className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Kilo</p>
                                                    <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">{log.weight_kg} kg</p>
                                                        {weightComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    weightComparison.isPositive
                                                                        ? "text-red-600"
                                                                        : "text-green-600"
                                                                }`}
                                                            >
                                                                {weightComparison.isPositive ? "+" : ""}
                                                                {weightComparison.diff.toFixed(1)} kg
                                                            </span>
                                                        )}
                                                    </div>
                                        </div>
                                    </div>
                                )}
                                {log.body_fat_percent && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                        <Activity className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Vücut Yağı</p>
                                                    <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">%{log.body_fat_percent}</p>
                                                        {bodyFatComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    bodyFatComparison.isPositive
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {bodyFatComparison.isPositive ? "-" : "+"}
                                                                {Math.abs(bodyFatComparison.diff).toFixed(1)}%
                                                            </span>
                                                        )}
                                                    </div>
                                        </div>
                                    </div>
                                )}
                                {log.muscle_mass_kg && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Kas Kütlesi</p>
                                                    <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">{log.muscle_mass_kg} kg</p>
                                                        {muscleMassComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    muscleMassComparison.isPositive
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {muscleMassComparison.isPositive ? "+" : ""}
                                                                {muscleMassComparison.diff.toFixed(1)} kg
                                                            </span>
                                                        )}
                                                    </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {log.notes && (
                                <div className="pt-3 border-t">
                                    <p className="text-xs text-muted-foreground mb-1">Notlar</p>
                                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{log.notes}</p>
                                </div>
                            )}
                        </div>
                            );
                        })}
                </div>
            )}
            </div>

            {/* Tüm Kayıtlar Sheet */}
            <Sheet open={isAllLogsSheetOpen} onOpenChange={setIsAllLogsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-6">
                    <SheetHeader className="px-0">
                        <SheetTitle>Tüm İlerleme Kayıtları</SheetTitle>
                        <SheetDescription>
                            {client && `${client.first_name} ${client.last_name} - `}Tüm ilerleme kayıtlarını görüntüleyin
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-3 px-0">
                        {progressLogs.map((log, index) => {
                            // Önceki kaydı bul
                            const previousLog = index < progressLogs.length - 1 ? progressLogs[index + 1] : null;

                            // Karşılaştırma fonksiyonu
                            const getComparison = (
                                current: number | null,
                                previous: number | null,
                                invert: boolean = false
                            ) => {
                                if (!current || !previous) return null;
                                const diff = current - previous;
                                const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : "0";
                                const isPositive = invert ? diff < 0 : diff > 0;
                                return { diff, percent, isPositive };
                            };

                            const weightComparison = getComparison(log.weight_kg, previousLog?.weight_kg || null);
                            const bodyFatComparison = getComparison(
                                log.body_fat_percent,
                                previousLog?.body_fat_percent || null,
                                true
                            );
                            const muscleMassComparison = getComparison(
                                log.muscle_mass_kg,
                                previousLog?.muscle_mass_kg || null
                            );

                            return (
                                <div key={log.id} className="border rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-sm">
                                            {new Date(log.log_date).toLocaleDateString("tr-TR", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                                        {log.weight_kg && (
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                                <Weight className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-muted-foreground">Kilo</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold">{log.weight_kg} kg</p>
                                                        {weightComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    weightComparison.isPositive
                                                                        ? "text-red-600"
                                                                        : "text-green-600"
                                                                }`}
                                                            >
                                                                {weightComparison.isPositive ? "+" : ""}
                                                                {weightComparison.diff.toFixed(1)} kg
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {log.body_fat_percent && (
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                                <Activity className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-muted-foreground">Vücut Yağı</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold">%{log.body_fat_percent}</p>
                                                        {bodyFatComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    bodyFatComparison.isPositive
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {bodyFatComparison.isPositive ? "-" : "+"}
                                                                {Math.abs(bodyFatComparison.diff).toFixed(1)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {log.muscle_mass_kg && (
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-muted-foreground">Kas Kütlesi</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold">{log.muscle_mass_kg} kg</p>
                                                        {muscleMassComparison && (
                                                            <span
                                                                className={`text-xs ${
                                                                    muscleMassComparison.isPositive
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {muscleMassComparison.isPositive ? "+" : ""}
                                                                {muscleMassComparison.diff.toFixed(1)} kg
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {log.notes && (
                                        <div className="pt-3 border-t">
                                            <p className="text-xs text-muted-foreground mb-1">Notlar</p>
                                            <p className="text-xs whitespace-pre-wrap leading-relaxed">{log.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SheetContent>
            </Sheet>

            {/* AI Kilo Değişimi Özeti Onay Dialog */}
            <Dialog open={isWeightSummaryConfirmOpen} onOpenChange={setIsWeightSummaryConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <DialogTitle>Önemli Uyarı</DialogTitle>
                        </div>
                        <DialogDescription className="space-y-3 pt-2">
                            <p className="text-sm text-foreground">
                                Bu veri <strong>yapay zeka tarafından analiz edilmektedir</strong>. 
                                Oluşturulan özetin doğruluğu ve yanlışı kanıtlanmış bir veri değildir.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Lütfen dikkat:</p>
                                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>AI analizi yalnızca bilgilendirme amaçlıdır</li>
                                    <li>Kesin tıbbi veya beslenme tavsiyesi değildir</li>
                                    <li>Sonuçları profesyonel görüş ile değerlendirin</li>
                                </ul>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsWeightSummaryConfirmOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={() => {
                                setIsWeightSummaryConfirmOpen(false);
                                fetchWeightSummary();
                            }}
                            className="w-full sm:w-auto"
                        >
                            Anladım, Devam Et
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Haftalık İlerleme Yorumu Onay Dialog */}
            <Dialog open={isWeeklyCommentConfirmOpen} onOpenChange={setIsWeeklyCommentConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <DialogTitle>Önemli Uyarı</DialogTitle>
                        </div>
                        <DialogDescription className="space-y-3 pt-2">
                            <p className="text-sm text-foreground">
                                Bu veri <strong>yapay zeka tarafından analiz edilmektedir</strong>. 
                                Oluşturulan yorumun doğruluğu ve yanlışı kanıtlanmış bir veri değildir.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Lütfen dikkat:</p>
                                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>AI analizi yalnızca bilgilendirme amaçlıdır</li>
                                    <li>Kesin tıbbi veya beslenme tavsiyesi değildir</li>
                                    <li>Sonuçları profesyonel görüş ile değerlendirin</li>
                                </ul>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsWeeklyCommentConfirmOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={() => {
                                setIsWeeklyCommentConfirmOpen(false);
                                fetchWeeklyComment();
                            }}
                            className="w-full sm:w-auto"
                        >
                            Anladım, Devam Et
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Kilo Değişimi Özeti Modal */}
            <Dialog 
                open={isWeightSummaryModalOpen} 
                onOpenChange={(open) => {
                    setIsWeightSummaryModalOpen(open);
                    if (!open) {
                        setWeightSummaryProgress(0);
                        setWeightSummaryResult(null);
                        setWeightSummaryError(null);
                    }
                }}
            >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            AI Kilo Değişimi Özeti
                        </DialogTitle>
                        <DialogDescription>
                            AI tarafından oluşturulan kilo değişimi analizi
                        </DialogDescription>
                    </DialogHeader>
                    {isLoadingSummary ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold">Özetiniz oluşturuluyor...</p>
                                <p className="text-sm text-muted-foreground">
                                    AI, kilo değişim verilerinizi analiz ediyor
                                </p>
                            </div>
                            <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">İlerleme</span>
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{weightSummaryProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500 ease-out rounded-full" 
                                        style={{ width: `${weightSummaryProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    {[0, 20, 40, 60, 80, 100].map((value) => (
                                        <div 
                                            key={value}
                                            className={`h-1 w-1 rounded-full ${
                                                weightSummaryProgress >= value 
                                                    ? 'bg-blue-600 dark:bg-blue-400' 
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : weightSummaryError ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
                                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold text-red-600 dark:text-red-400">Hata Oluştu</p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    {weightSummaryError}
                                </p>
                            </div>
                            <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">İlerleme</span>
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">{weightSummaryProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-red-600 dark:bg-red-400 transition-all duration-500 ease-out rounded-full" 
                                        style={{ width: `${weightSummaryProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    {[0, 20, 40, 60, 80, 100].map((value) => (
                                        <div 
                                            key={value}
                                            className={`h-1 w-1 rounded-full ${
                                                weightSummaryProgress >= value 
                                                    ? 'bg-red-600 dark:bg-red-400' 
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : weightSummaryResult ? (
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {weightSummaryResult}
                                </p>
                            </div>
                        </div>
                    ) : null}
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                setIsWeightSummaryModalOpen(false);
                            }}
                        >
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Haftalık İlerleme Yorumu Modal */}
            <Dialog 
                open={isWeeklyCommentModalOpen} 
                onOpenChange={(open) => {
                    setIsWeeklyCommentModalOpen(open);
                    if (!open) {
                        setWeeklyCommentProgress(0);
                        setWeeklyCommentResult(null);
                        setWeeklyCommentErrorModal(null);
                    }
                }}
            >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            AI Haftalık İlerleme Yorumu
                        </DialogTitle>
                        <DialogDescription>
                            AI tarafından oluşturulan haftalık ilerleme analizi
                        </DialogDescription>
                    </DialogHeader>
                    {isLoadingComment ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
                                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold">Yorumunuz oluşturuluyor...</p>
                                <p className="text-sm text-muted-foreground">
                                    AI, haftalık ilerleme verilerinizi analiz ediyor
                                </p>
                            </div>
                            <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">İlerleme</span>
                                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{weeklyCommentProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-purple-600 dark:bg-purple-400 transition-all duration-500 ease-out rounded-full" 
                                        style={{ width: `${weeklyCommentProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    {[0, 20, 40, 60, 80, 100].map((value) => (
                                        <div 
                                            key={value}
                                            className={`h-1 w-1 rounded-full ${
                                                weeklyCommentProgress >= value 
                                                    ? 'bg-purple-600 dark:bg-purple-400' 
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : weeklyCommentErrorModal ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
                                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold text-red-600 dark:text-red-400">Hata Oluştu</p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    {weeklyCommentErrorModal}
                                </p>
                            </div>
                            <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">İlerleme</span>
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">{weeklyCommentProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-red-600 dark:bg-red-400 transition-all duration-500 ease-out rounded-full" 
                                        style={{ width: `${weeklyCommentProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    {[0, 20, 40, 60, 80, 100].map((value) => (
                                        <div 
                                            key={value}
                                            className={`h-1 w-1 rounded-full ${
                                                weeklyCommentProgress >= value 
                                                    ? 'bg-red-600 dark:bg-red-400' 
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : weeklyCommentResult ? (
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {weeklyCommentResult}
                                </p>
                            </div>
                        </div>
                    ) : null}
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                setIsWeeklyCommentModalOpen(false);
                            }}
                        >
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Yeni İlerleme Kaydı</DialogTitle>
                        <DialogDescription>
                            Danışan için yeni bir ilerleme kaydı oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Önceki Kayıtlar */}
                    {progressLogs.length > 0 && (
                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Son Kayıtlar (Referans)</p>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                {progressLogs.slice(0, 3).map((prevLog) => (
                                    <div key={prevLog.id} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium">
                                                {new Date(prevLog.log_date).toLocaleDateString("tr-TR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 text-muted-foreground">
                                            {prevLog.weight_kg && (
                                                <span>Kilo: {prevLog.weight_kg} kg</span>
                                            )}
                                            {prevLog.body_fat_percent && (
                                                <span>Vücut Yağı: %{prevLog.body_fat_percent}</span>
                                            )}
                                            {prevLog.muscle_mass_kg && (
                                                <span>Kas: {prevLog.muscle_mass_kg} kg</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleCreateProgressLog} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="log_date">Tarih</Label>
                            <Input
                                id="log_date"
                                type="date"
                                value={formData.log_date}
                                onChange={(e) =>
                                    setFormData({ ...formData, log_date: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight_kg">Kilo (kg)</Label>
                                <Input
                                    id="weight_kg"
                                    type="number"
                                    step="0.1"
                                    value={formData.weight_kg}
                                    onChange={(e) =>
                                        setFormData({ ...formData, weight_kg: e.target.value })
                                    }
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="body_fat_percent">Vücut Yağı (%)</Label>
                                <Input
                                    id="body_fat_percent"
                                    type="number"
                                    step="0.1"
                                    value={formData.body_fat_percent}
                                    onChange={(e) =>
                                        setFormData({ ...formData, body_fat_percent: e.target.value })
                                    }
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="muscle_mass_kg">Kas Kütlesi (kg)</Label>
                                <Input
                                    id="muscle_mass_kg"
                                    type="number"
                                    step="0.1"
                                    value={formData.muscle_mass_kg}
                                    onChange={(e) =>
                                        setFormData({ ...formData, muscle_mass_kg: e.target.value })
                                    }
                                    placeholder="0.0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notlar</Label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Notlar..."
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={isCreating}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Oluşturuluyor..." : "Oluştur"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
