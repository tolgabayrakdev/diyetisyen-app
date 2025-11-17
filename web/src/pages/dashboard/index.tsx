import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Users, TrendingUp, Plus, FileText, DollarSign } from "lucide-react";

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
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                <p className="text-muted-foreground">
                    {user.first_name} {user.last_name}, Diyetka sistemine hoş geldiniz.
                </p>
            </div>

            {/* İstatistikler */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">İstatistikler</h2>
                        <p className="text-sm text-muted-foreground">
                            Genel bakış ve özet bilgiler
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Toplam Danışan</Label>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">Aktif danışan sayısı</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Diyet Planları</Label>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalDietPlans}</div>
                        <p className="text-xs text-muted-foreground">Oluşturulan planlar</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Notlar</Label>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalNotes}</div>
                        <p className="text-xs text-muted-foreground">Kaydedilen notlar</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Finansal Kayıt</Label>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalFinancial}</div>
                        <p className="text-xs text-muted-foreground">Toplam kayıt</p>
                    </div>
                </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Hızlı Erişim</h2>
                        <p className="text-sm text-muted-foreground">
                            En sık kullanılan işlemler
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => navigate("/clients")}
                    >
                        <Users className="h-4 w-4" />
                        Tüm Danışanlar
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => navigate("/clients")}
                    >
                        <Plus className="h-4 w-4" />
                        Yeni Danışan Ekle
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => navigate("/activity-logs")}
                    >
                        <TrendingUp className="h-4 w-4" />
                        Aktivite Logları
                    </Button>
                </div>
            </div>
        </div>
    );
}
