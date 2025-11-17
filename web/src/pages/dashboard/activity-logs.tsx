import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Activity, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function ActivityLogsPage() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, clientId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "50",
            });
            if (clientId) {
                params.append("clientId", clientId);
            }

            const response = await fetch(apiUrl(`api/activity-logs?${params}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Aktivite logları yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setLogs(data.logs);
                setTotalPages(data.pagination?.totalPages || 1);
            }
        } catch {
            toast.error("Aktivite logları yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

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
        };
        return labels[entityType] || entityType;
    };

    if (loading && logs.length === 0) {
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
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Aktivite Logları</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Sistemdeki tüm aktiviteleri görüntüleyin
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Danışan ID ile filtrele..."
                        value={clientId || ""}
                        onChange={(e) => {
                            setClientId(e.target.value || null);
                            setPage(1);
                        }}
                        className="pl-10"
                    />
                </div>
                {clientId && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setClientId(null);
                            setPage(1);
                        }}
                    >
                        Filtreyi Temizle
                    </Button>
                )}
            </div>

            {/* Logs List */}
            {logs.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Henüz aktivite logu yok</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {getActionTypeBadge(log.action_type)}
                                            {log.entity_type && (
                                                <Badge variant="outline" className="text-xs">
                                                    {getEntityTypeLabel(log.entity_type)}
                                                </Badge>
                                            )}
                                            {log.client_first_name && log.client_last_name && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <User className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">
                                                        {log.client_first_name} {log.client_last_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {log.description && (
                                            <p className="text-xs leading-relaxed">{log.description}</p>
                                        )}
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3 shrink-0" />
                                            <span>
                                                {new Date(log.created_at).toLocaleString("tr-TR", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Sayfa {page} / {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Önceki
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Sonraki
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


