import { useState, useEffect } from "react";
import { Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DollarSign, Search, Filter, User, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FinancialPDFReport } from "@/components/financial-pdf-report";

interface FinancialRecord {
    id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    amount: number;
    currency: string;
    payment_date: string | null;
    status: string;
    payment_method: string | null;
    description: string | null;
    created_at: string;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
}

export default function FinancialRecordsPage() {
    const [loading, setLoading] = useState(true);
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [clientFilter, setClientFilter] = useState<string>("all");
    const [timeFilter, setTimeFilter] = useState<string>("all"); // all, weekly, monthly, yearly
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        fetchFinancialRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter, clientFilter, timeFilter]);

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

    const fetchFinancialRecords = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "1000"); // Tüm kayıtları çekmek için limit artırıldı (zaman filtresi için)
            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }
            if (clientFilter !== "all") {
                params.append("client_id", clientFilter);
            }

            const response = await fetch(apiUrl(`api/financial-records?${params.toString()}`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // API'den gelen amount değerlerini number'a dönüştür
                    let records = (data.records || []).map((record: FinancialRecord) => ({
                        ...record,
                        amount: typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount,
                    }));

                    // Zaman filtresi uygula
                    if (timeFilter !== "all") {
                        const now = new Date();
                        const filterDate = new Date();
                        
                        if (timeFilter === "weekly") {
                            filterDate.setDate(now.getDate() - 7);
                        } else if (timeFilter === "monthly") {
                            filterDate.setMonth(now.getMonth() - 1);
                        } else if (timeFilter === "yearly") {
                            filterDate.setFullYear(now.getFullYear() - 1);
                        }
                        
                        records = records.filter((record: FinancialRecord) => {
                            const recordDate = new Date(record.payment_date || record.created_at);
                            return recordDate >= filterDate;
                        });
                    }

                    setFinancialRecords(records);
                    setTotalPages(data.pagination?.totalPages || 1);
                    setTotal(records.length);
                }
            }
        } catch {
            toast.error("Finansal kayıtlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = financialRecords.filter((record) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const clientName = `${record.first_name} ${record.last_name}`.toLowerCase();
        const description = (record.description || "").toLowerCase();
        return (
            clientName.includes(searchLower) ||
            description.includes(searchLower) ||
            record.amount.toString().includes(searchTerm)
        );
    });

    // İstatistikler için tüm kayıtları çekmek gerekebilir, şimdilik mevcut kayıtlar üzerinden hesaplıyoruz
    const totalAmount = filteredRecords.reduce((sum, record) => sum + Number(record.amount), 0);
    const paidAmount = filteredRecords
        .filter((r) => r.status === "paid")
        .reduce((sum, record) => sum + Number(record.amount), 0);
    const pendingAmount = filteredRecords
        .filter((r) => r.status === "pending")
        .reduce((sum, record) => sum + Number(record.amount), 0);
    const overdueAmount = filteredRecords
        .filter((r) => r.status === "overdue")
        .reduce((sum, record) => sum + Number(record.amount), 0);

    // En fazla ücret alınan danışanlar (top 10)
    const topClients = filteredRecords
        .filter((r) => r.status === "paid")
        .reduce((acc: { [key: string]: { client_id: string; name: string; total: number } }, record) => {
            const key = record.client_id;
            if (!acc[key]) {
                acc[key] = {
                    client_id: record.client_id,
                    name: `${record.first_name} ${record.last_name}`,
                    total: 0,
                };
            }
            acc[key].total += Number(record.amount);
            return acc;
        }, {});
    
    const topClientsList = Object.values(topClients)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

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
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Finansal Kayıtlar</h1>
                    <p className="text-sm text-muted-foreground">
                        Tüm danışanların finansal kayıtlarını görüntüleyin ve yönetin
                    </p>
                </div>
                {filteredRecords.length > 0 && (() => {
                    const selectedClient = clientFilter !== "all" 
                        ? clients.find(c => c.id === clientFilter) 
                        : null;
                    return (
                        <FinancialPDFReport
                            records={filteredRecords}
                            totalAmount={totalAmount}
                            paidAmount={paidAmount}
                            pendingAmount={pendingAmount}
                            overdueAmount={overdueAmount}
                            filters={{
                                searchTerm,
                                statusFilter,
                                clientFilter,
                                clientName: selectedClient 
                                    ? `${selectedClient.first_name} ${selectedClient.last_name}`
                                    : undefined,
                                timeFilter,
                            }}
                        />
                    );
                })()}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Toplam</p>
                    <p className="text-2xl font-semibold">{totalAmount.toFixed(2)} ₺</p>
                </div>
                <div className="border border-green-500 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Ödenen</p>
                    <p className="text-2xl font-semibold text-green-600">{paidAmount.toFixed(2)} ₺</p>
                </div>
                <div className="border border-orange-500 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Bekleyen</p>
                    <p className="text-2xl font-semibold text-orange-600">{pendingAmount.toFixed(2)} ₺</p>
                </div>
                <div className="border border-red-500 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Gecikmiş</p>
                    <p className="text-2xl font-semibold text-red-600">{overdueAmount.toFixed(2)} ₺</p>
                </div>
            </div>

            {/* Top Clients Section */}
            {topClientsList.length > 0 && (
                <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">En Fazla Ücret Alınan Danışanlar</h2>
                            <p className="text-sm text-muted-foreground">
                                Ödenen kayıtlara göre sıralama
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {topClientsList.map((client, index) => (
                            <Link
                                key={client.client_id}
                                to={`/clients/${client.client_id}/financial`}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {Number(client.total).toFixed(2)} ₺
                                        </p>
                                    </div>
                                </div>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Filtrele ve Ara</h2>
                        <p className="text-sm text-muted-foreground">
                            Finansal kayıtları filtreleyin ve arayın
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Danışan adı, açıklama veya tutar ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={timeFilter} onValueChange={(value) => {
                        setTimeFilter(value);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Zaman" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Zamanlar</SelectItem>
                            <SelectItem value="weekly">Son 7 Gün</SelectItem>
                            <SelectItem value="monthly">Son 1 Ay</SelectItem>
                            <SelectItem value="yearly">Son 1 Yıl</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Durum" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Durumlar</SelectItem>
                            <SelectItem value="pending">Beklemede</SelectItem>
                            <SelectItem value="paid">Ödendi</SelectItem>
                            <SelectItem value="overdue">Gecikmiş</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={clientFilter} onValueChange={(value) => {
                        setClientFilter(value);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Danışan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Danışanlar</SelectItem>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Financial Records Table */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Kayıtlar</h2>
                        <p className="text-sm text-muted-foreground">
                            {total} kayıt bulundu
                        </p>
                    </div>
                </div>
                
                <Separator />

                {filteredRecords.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                            {searchTerm || statusFilter !== "all" || clientFilter !== "all"
                                ? "Filtrelere uygun kayıt bulunamadı"
                                : "Henüz finansal kayıt yok"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Danışan</TableHead>
                                        <TableHead>Tutar</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead>Ödeme Tarihi</TableHead>
                                        <TableHead>Ödeme Yöntemi</TableHead>
                                        <TableHead>Açıklama</TableHead>
                                        <TableHead>Oluşturulma</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <Link
                                                    to={`/clients/${record.client_id}/financial`}
                                                    className="flex items-center gap-2 text-primary hover:underline"
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>
                                                        {record.first_name} {record.last_name}
                                                    </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {Number(record.amount).toFixed(2)} {record.currency}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        record.status === "paid"
                                                            ? "default"
                                                            : record.status === "overdue"
                                                            ? "destructive"
                                                            : "secondary"
                                                    }
                                                >
                                                    {record.status === "paid"
                                                        ? "Ödendi"
                                                        : record.status === "overdue"
                                                        ? "Gecikmiş"
                                                        : "Beklemede"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {record.payment_date
                                                    ? new Date(record.payment_date).toLocaleDateString("tr-TR")
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {record.payment_method || "-"}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {record.description || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(record.created_at).toLocaleDateString("tr-TR")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Sayfa {page} / {totalPages}
                                </p>
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
        </div>
    );
}

