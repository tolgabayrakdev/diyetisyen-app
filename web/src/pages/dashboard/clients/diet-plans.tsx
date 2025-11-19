import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, FileText, Calendar } from "lucide-react";
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

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    template_id?: string | null;
    created_at: string;
}

export default function ClientDietPlansPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | null>(null);
    const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    useEffect(() => {
        if (id) {
            fetchClient();
            fetchDietPlans();
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

    const fetchDietPlans = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/diet-plans`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDietPlans(data.dietPlans || []);
                }
            }
        } catch (error) {
            toast.error("Diyet planları yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDietPlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const response = await fetch(apiUrl(`api/clients/${id}/diet-plans`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || null,
                    start_date: formData.start_date || null,
                    end_date: formData.end_date || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Diyet planı oluşturulamadı");
            }

            toast.success("Diyet planı başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                title: "",
                description: "",
                start_date: "",
                end_date: "",
            });
            fetchDietPlans();
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
                        <BreadcrumbPage>Diyet Planları</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Diyet Planları</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {client && `${client.first_name} ${client.last_name} - `}Diyet planlarını yönetin
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Plan
                </Button>
            </div>

            {/* Diet Plans List */}
            {dietPlans.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz diyet planı yok</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        İlk Planı Oluştur
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {dietPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/clients/${id}/diet-plans/${plan.id}`)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm mb-1 truncate">{plan.title}</h3>
                                    {plan.description && (
                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                            {plan.description}
                                        </p>
                                    )}
                                    {plan.start_date && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">
                                                {new Date(plan.start_date).toLocaleDateString("tr-TR")}
                                                {plan.end_date && ` - ${new Date(plan.end_date).toLocaleDateString("tr-TR")}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni Diyet Planı</DialogTitle>
                        <DialogDescription>
                            Danışan için yeni bir diyet planı oluşturun.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateDietPlan} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                                placeholder="Örn: Kilo Verme Planı"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Plan hakkında açıklama..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Başlangıç Tarihi</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Bitiş Tarihi</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
                            </div>
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
