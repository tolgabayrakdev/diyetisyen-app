import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, TrendingUp, Weight, Activity } from "lucide-react";
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

interface Client {
    id: string;
    first_name: string;
    last_name: string;
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
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Kayıt
                </Button>
            </div>

            {/* Progress Logs List */}
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
                    {progressLogs.map((log) => (
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
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Kilo</p>
                                            <p className="text-sm font-semibold">{log.weight_kg} kg</p>
                                        </div>
                                    </div>
                                )}
                                {log.body_fat_percent && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                        <Activity className="h-4 w-4 text-primary shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Vücut Yağı</p>
                                            <p className="text-sm font-semibold">%{log.body_fat_percent}</p>
                                        </div>
                                    </div>
                                )}
                                {log.muscle_mass_kg && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Kas Kütlesi</p>
                                            <p className="text-sm font-semibold">{log.muscle_mass_kg} kg</p>
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
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni İlerleme Kaydı</DialogTitle>
                        <DialogDescription>
                            Danışan için yeni bir ilerleme kaydı oluşturun.
                        </DialogDescription>
                    </DialogHeader>
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
