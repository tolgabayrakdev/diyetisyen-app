import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface FinancialRecord {
    id: string;
    amount: number;
    currency: string;
    payment_date: string | null;
    status: string;
    payment_method: string | null;
    description: string | null;
    created_at: string;
}

export default function ClientFinancialPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | null>(null);
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        currency: "TRY",
        payment_date: "",
        status: "pending",
        payment_method: "",
        description: "",
    });

    useEffect(() => {
        if (id) {
            fetchClient();
            fetchFinancialRecords();
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

    const fetchFinancialRecords = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/financial-records`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // API'den gelen amount değerlerini number'a dönüştür
                    const records = (data.records || []).map((record: FinancialRecord) => ({
                        ...record,
                        amount: typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount,
                    }));
                    setFinancialRecords(records);
                }
            }
        } catch {
            toast.error("Finansal kayıtlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFinancialRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const response = await fetch(apiUrl(`api/clients/${id}/financial-records`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    currency: formData.currency,
                    payment_date: formData.payment_date || null,
                    status: formData.status,
                    payment_method: formData.payment_method || null,
                    description: formData.description || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Finansal kayıt oluşturulamadı");
            }

            toast.success("Finansal kayıt başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                amount: "",
                currency: "TRY",
                payment_date: "",
                status: "pending",
                payment_method: "",
                description: "",
            });
            fetchFinancialRecords();
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

    const totalAmount = financialRecords.reduce((sum, record) => sum + Number(record.amount), 0);
    const paidAmount = financialRecords
        .filter((r) => r.status === "paid")
        .reduce((sum, record) => sum + Number(record.amount), 0);
    const pendingAmount = financialRecords
        .filter((r) => r.status === "pending")
        .reduce((sum, record) => sum + Number(record.amount), 0);

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
                        <BreadcrumbPage>Finansal Kayıtlar</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Finansal Kayıtlar</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {client && `${client.first_name} ${client.last_name} - `}Finansal kayıtları yönetin
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Kayıt
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Toplam</p>
                    <p className="text-lg font-semibold">{totalAmount.toFixed(2)} ₺</p>
                </div>
                <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Ödenen</p>
                    <p className="text-lg font-semibold text-green-600">{paidAmount.toFixed(2)} ₺</p>
                </div>
                <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Bekleyen</p>
                    <p className="text-lg font-semibold text-orange-600">{pendingAmount.toFixed(2)} ₺</p>
                </div>
            </div>

            {/* Financial Records List */}
            {financialRecords.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz finansal kayıt yok</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        İlk Kaydı Oluştur
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {financialRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <p className="text-base font-semibold">
                                            {Number(record.amount).toFixed(2)} {record.currency}
                                        </p>
                                        <Badge
                                            variant={
                                                record.status === "paid"
                                                    ? "default"
                                                    : record.status === "overdue"
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {record.status === "paid"
                                                ? "Ödendi"
                                                : record.status === "overdue"
                                                ? "Gecikmiş"
                                                : "Beklemede"}
                                        </Badge>
                                    </div>
                                    {record.description && (
                                        <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">
                                            {record.description}
                                        </p>
                                    )}
                                    {record.payment_method && (
                                        <p className="text-xs text-muted-foreground">
                                            Ödeme: {record.payment_method}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    {record.payment_date && (
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(record.payment_date).toLocaleDateString("tr-TR")}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(record.created_at).toLocaleDateString("tr-TR")}
                                    </p>
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
                        <DialogTitle>Yeni Finansal Kayıt</DialogTitle>
                        <DialogDescription>
                            Danışan için yeni bir finansal kayıt oluşturun.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateFinancialRecord} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Tutar *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Para Birimi</Label>
                                <select
                                    id="currency"
                                    value={formData.currency}
                                    onChange={(e) =>
                                        setFormData({ ...formData, currency: e.target.value })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="TRY">TRY</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Durum</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="pending">Beklemede</option>
                                    <option value="paid">Ödendi</option>
                                    <option value="overdue">Gecikmiş</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_date">Ödeme Tarihi</Label>
                                <Input
                                    id="payment_date"
                                    type="date"
                                    value={formData.payment_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, payment_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Ödeme Yöntemi</Label>
                            <Input
                                id="payment_method"
                                value={formData.payment_method}
                                onChange={(e) =>
                                    setFormData({ ...formData, payment_method: e.target.value })
                                }
                                placeholder="Örn: Nakit, Kredi Kartı, Havale"
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
                                placeholder="Açıklama..."
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
