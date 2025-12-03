import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, FileText, DollarSign, Activity, Clock, ArrowRight } from "lucide-react";

interface UserData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

interface Stats {
    totalClients: number;
    totalDietPlans: number;
    totalNotes: number;
    totalFinancial: number;
}

interface ActivityLog {
    id: string;
    client_id: string | null;
    client_first_name: string | null;
    client_last_name: string | null;
    entity_type: string | null;
    action_type: string | null;
    description: string | null;
    created_at: string;
}

interface RecentClient {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
}

export default function DashboardIndex() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        totalClients: 0,
        totalDietPlans: 0,
        totalNotes: 0,
        totalFinancial: 0,
    });
    const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
    const [recentClients, setRecentClients] = useState<RecentClient[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user
                const userResponse = await fetch(apiUrl("api/auth/me"), {
                    method: "GET",
                    credentials: "include",
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.success && userData.user) {
                        setUser(userData.user);
                    }
                }

                // Fetch statistics
                const statisticsResponse = await fetch(apiUrl("api/statistics"), {
                    method: "GET",
                    credentials: "include",
                });

                if (statisticsResponse.ok) {
                    const statisticsData = await statisticsResponse.json();
                    if (statisticsData.success) {
                        setStats({
                            totalClients: statisticsData.totalClients || 0,
                            totalDietPlans: statisticsData.totalDietPlans || 0,
                            totalNotes: statisticsData.totalNotes || 0,
                            totalFinancial: statisticsData.totalFinancial || 0,
                        });
                    }
                }

                // Fetch recent activities
                const activitiesResponse = await fetch(apiUrl("api/activity-logs?page=1&limit=5"), {
                    method: "GET",
                    credentials: "include",
                });

                if (activitiesResponse.ok) {
                    const activitiesData = await activitiesResponse.json();
                    if (activitiesData.success) {
                        setRecentActivities(activitiesData.logs || []);
                    }
                }

                // Fetch recent clients
                const clientsResponse = await fetch(apiUrl("api/clients?page=1&limit=5"), {
                    method: "GET",
                    credentials: "include",
                });

                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    if (clientsData.success) {
                        setRecentClients(clientsData.clients || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Kullanıcı bilgileri yüklenemedi</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2" data-tour="welcome">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    {user.first_name} {user.last_name}, Diyetka sistemine hoş geldiniz.
                </p>
            </div>

            {/* İstatistikler */}
            <div className="space-y-6" data-tour="dashboard-stats">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold">İstatistikler</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Genel bakış ve özet bilgiler
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Label className="text-xs sm:text-sm font-medium">Toplam Danışan</Label>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">Aktif danışan sayısı</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Label className="text-xs sm:text-sm font-medium">Diyet Planları</Label>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalDietPlans}</div>
                        <p className="text-xs text-muted-foreground">Oluşturulan planlar</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Label className="text-xs sm:text-sm font-medium">Notlar</Label>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalNotes}</div>
                        <p className="text-xs text-muted-foreground">Kaydedilen notlar</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Label className="text-xs sm:text-sm font-medium">Finansal Kayıt</Label>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalFinancial}</div>
                        <p className="text-xs text-muted-foreground">Toplam kayıt</p>
                    </div>
                </div>
            </div>

            {/* Son Eklenen Danışanlar */}
            {recentClients.length > 0 && (
                <div className="space-y-4 mt-6 sm:mt-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold">Son Eklenen Danışanlar</h2>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/clients")}
                            className="w-full sm:w-auto"
                        >
                            Tümünü Gör
                        </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1.5">
                        {recentClients.map((client) => {
                            const formatTimeAgo = (dateString: string) => {
                                const date = new Date(dateString);
                                const now = new Date();
                                const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
                                
                                if (diffInSeconds < 60) return "Az önce";
                                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
                                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa önce`;
                                if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
                                
                                return date.toLocaleDateString("tr-TR", {
                                    day: "numeric",
                                    month: "short",
                                });
                            };

                            return (
                                <button
                                    key={client.id}
                                    onClick={() => navigate(`/clients/${client.id}`)}
                                    className="group flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm w-full text-left"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Users className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {client.first_name} {client.last_name}
                                            </p>
                                            {client.email && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {client.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-muted-foreground">{formatTimeAgo(client.created_at)}</span>
                                        <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Son Aktiviteler */}
            <div className="space-y-4 mt-6 sm:mt-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold">Son Aktiviteler</h2>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/activity-logs")}
                        className="w-full sm:w-auto"
                    >
                        Tümünü Gör
                    </Button>
                </div>
                
                <Separator />
                
                {recentActivities.length === 0 ? (
                    <div className="text-center py-6 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Henüz aktivite kaydı yok</p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {recentActivities.map((log) => {
                            const getActionTypeBadge = (actionType: string | null) => {
                                if (!actionType) return null;
                                const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
                                    create: { label: "Oluşturuldu", variant: "default" },
                                    update: { label: "Güncellendi", variant: "secondary" },
                                    delete: { label: "Silindi", variant: "destructive" },
                                };
                                const action = variants[actionType] || { label: actionType, variant: "outline" as const };
                                return <Badge variant={action.variant} className="text-xs">{action.label}</Badge>;
                            };

                            const getEntityTypeLabel = (entityType: string | null) => {
                                if (!entityType) return "Bilinmeyen";
                                const labels: Record<string, string> = {
                                    client: "Danışan",
                                    diet_plan: "Diyet Planı",
                                    note: "Not",
                                    financial_record: "Finansal Kayıt",
                                    progress_log: "İlerleme Kaydı",
                                    document: "Belge",
                                    food: "Besin",
                                    food_category: "Besin Kategorisi",
                                };
                                return labels[entityType] || entityType;
                            };

                            const formatTimeAgo = (dateString: string) => {
                                const date = new Date(dateString);
                                const now = new Date();
                                const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
                                
                                if (diffInSeconds < 60) return "Az önce";
                                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk`;
                                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa`;
                                if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün`;
                                
                                return date.toLocaleDateString("tr-TR", {
                                    day: "numeric",
                                    month: "short",
                                });
                            };

                            return (
                                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {getActionTypeBadge(log.action_type)}
                                        {log.entity_type && (
                                            <span className="text-muted-foreground text-xs hidden sm:inline">
                                                {getEntityTypeLabel(log.entity_type)}
                                            </span>
                                        )}
                                        {log.description && (
                                            <span className="text-foreground truncate text-xs sm:text-sm">
                                                {log.description}
                                            </span>
                                        )}
                                        {!log.description && log.client_first_name && log.client_last_name && (
                                            <span className="text-muted-foreground truncate text-xs sm:text-sm">
                                                {log.client_first_name} {log.client_last_name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatTimeAgo(log.created_at)}</span>
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
