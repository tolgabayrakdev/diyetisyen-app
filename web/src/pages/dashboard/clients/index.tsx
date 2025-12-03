import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Search, User, Phone, Mail, Trash2, Eye, Loader2, CalendarIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    birth_date: string | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    created_at: string;
}

interface Subscription {
    id: string;
    plan_name: string;
    is_trial: boolean;
    client_limit: number | null;
    status: string;
}

export default function ClientsPage() {
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const wasFocusedRef = useRef(false);
    const cursorPositionRef = useRef<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        birth_date: "",
        gender: "",
        height_cm: "",
        weight_kg: "",
        chronic_conditions: "",
        allergies: "",
        medications: "",
    });
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [isBirthDatePopoverOpen, setIsBirthDatePopoverOpen] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset birth date when dialog opens
    useEffect(() => {
        if (isCreateDialogOpen) {
            setBirthDate(undefined);
            setIsBirthDatePopoverOpen(false);
        }
    }, [isCreateDialogOpen]);

    // Fetch clients when page or debounced search term changes
    useEffect(() => {
        fetchClients();
        fetchSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, debouncedSearchTerm]);

    // Restore focus and cursor position after render if it was focused before
    useEffect(() => {
        if (wasFocusedRef.current && searchInputRef.current) {
            // Use requestAnimationFrame to ensure DOM is updated
            requestAnimationFrame(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    // Restore cursor position
                    const position = cursorPositionRef.current ?? searchTerm.length;
                    searchInputRef.current.setSelectionRange(position, position);
                }
            });
        }
    }, [clients, searchTerm]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (debouncedSearchTerm) {
                params.append("search", debouncedSearchTerm);
            }

            const response = await fetch(apiUrl(`api/clients?${params}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Danışanlar yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setClients(data.clients);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotal(data.pagination?.total || 0);
            }
        } catch {
            toast.error("Danışanlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await fetch(apiUrl("api/subscription/"), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.subscription) {
                    setSubscription(data.subscription);
                }
            }
        } catch (error) {
            // Subscription yoksa sessizce devam et
            console.error("Subscription fetch error:", error);
        }
    };

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl("api/clients"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    birth_date: formData.birth_date || null,
                    gender: formData.gender || null,
                    height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
                    weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                    chronic_conditions: formData.chronic_conditions || null,
                    allergies: formData.allergies || null,
                    medications: formData.medications || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Danışan oluşturulamadı");
            }

            toast.success("Danışan başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                birth_date: "",
                gender: "",
                height_cm: "",
                weight_kg: "",
                chronic_conditions: "",
                allergies: "",
                medications: "",
            });
            setBirthDate(undefined);
            fetchClients();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        }
    };

    const handleDeleteClient = async (clientId: string) => {
        if (!confirm("Bu danışanı silmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            setIsDeleting(clientId);
            const response = await fetch(apiUrl(`api/clients/${clientId}`), {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Danışan silinemedi");
            }

            toast.success("Danışan başarıyla silindi");
            fetchClients();
        } catch {
            toast.error("Danışan silinirken bir hata oluştu");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        // Save cursor position before state update
        cursorPositionRef.current = input.selectionStart;
        setSearchTerm(input.value);
        wasFocusedRef.current = true;
    };

    const handleSearchFocus = () => {
        wasFocusedRef.current = true;
    };

    const handleSearchBlur = () => {
        wasFocusedRef.current = false;
    };

    if (loading && clients.length === 0) {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Danışanlar</h1>
                    <p className="text-muted-foreground mt-1">
                        Danışanlarınızı yönetin ve takip edin
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Danışan
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={searchInputRef}
                    placeholder="Danışan ara (ad, soyad, e-posta, telefon)..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="pl-10"
                />
            </div>

            {/* Progress Bar - Danışan Limiti */}
            {subscription && (
                <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Danışan Limiti</span>
                            <Badge
                                variant={subscription.is_trial ? "secondary" : subscription.plan_name === 'pro' ? "default" : "outline"}
                                className="text-[10px] px-2 py-0 h-4"
                            >
                                {subscription.is_trial 
                                    ? 'Deneme' 
                                    : subscription.plan_name === 'pro' 
                                        ? 'Pro' 
                                        : subscription.plan_name === 'standard'
                                            ? 'Standard'
                                            : subscription.plan_name}
                            </Badge>
                        </div>
                        {subscription.client_limit !== null ? (
                            <span className="text-xs text-muted-foreground font-medium">
                                {total} / {subscription.client_limit}
                            </span>
                        ) : (
                            <span className="text-xs text-muted-foreground font-medium">
                                {total} / Sınırsız
                            </span>
                        )}
                    </div>
                    {subscription.client_limit !== null ? (
                        <>
                            <Progress 
                                value={Math.min((total / subscription.client_limit) * 100, 100)}
                                className="h-1.5"
                            />
                            {total >= subscription.client_limit && (
                                <p className="text-[11px] text-destructive">
                                    Danışan limitine ulaştınız. Daha fazla danışan eklemek için planınızı yükseltin.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-[11px] text-muted-foreground">
                            Pro planınız ile sınırsız danışan ekleyebilirsiniz.
                        </p>
                    )}
                </div>
            )}

            {/* Table */}
            {clients.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Henüz danışan yok</h3>
                    <p className="text-muted-foreground mb-4">
                        İlk danışanınızı ekleyerek başlayın
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Yeni Danışan Ekle
                    </Button>
                </div>
            ) : (
                <>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ad Soyad</TableHead>
                                    <TableHead>İletişim</TableHead>
                                    <TableHead>Doğum Tarihi</TableHead>
                                    <TableHead>Boy / Kilo</TableHead>
                                    <TableHead>Kayıt Tarihi</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/clients/${client.id}`)}>
                                        <TableCell className="font-medium">
                                            {client.first_name} {client.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                {client.email && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        {client.email}
                                                    </div>
                                                )}
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {client.birth_date
                                                ? new Date(client.birth_date).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {client.height_cm || client.weight_kg
                                                ? `${client.height_cm || "-"} cm / ${client.weight_kg || "-"} kg`
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(client.created_at).toLocaleDateString("tr-TR")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/clients/${client.id}`)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClient(client.id)}
                                                    disabled={isDeleting === client.id}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    {isDeleting === client.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-muted-foreground">
                                Toplam {total} danışan - Sayfa {page} / {totalPages}
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

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Yeni Danışan Ekle</DialogTitle>
                        <DialogDescription>
                            Yeni bir danışan eklemek için aşağıdaki bilgileri doldurun.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClient} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Ad *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, first_name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Soyad *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, last_name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Doğum Tarihi</Label>
                                <Popover open={isBirthDatePopoverOpen} onOpenChange={setIsBirthDatePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="birth_date"
                                            variant="outline"
                                            className={`w-full justify-start text-left font-normal ${
                                                !birthDate ? "text-muted-foreground" : ""
                                            }`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {birthDate ? (
                                                format(birthDate, "PPP", { locale: tr })
                                            ) : (
                                                <span>Tarih seçin</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={birthDate}
                                            defaultMonth={birthDate || new Date()}
                                            onSelect={(date) => {
                                                setBirthDate(date);
                                                setFormData({
                                                    ...formData,
                                                    birth_date: date ? format(date, "yyyy-MM-dd") : "",
                                                });
                                                if (date) {
                                                    setIsBirthDatePopoverOpen(false);
                                                }
                                            }}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            captionLayout="dropdown"
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Cinsiyet</Label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gender: e.target.value })
                                    }
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="male">Erkek</option>
                                    <option value="female">Kadın</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="height_cm">Boy (cm)</Label>
                                <Input
                                    id="height_cm"
                                    type="number"
                                    value={formData.height_cm}
                                    onChange={(e) =>
                                        setFormData({ ...formData, height_cm: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight_kg">Kilo (kg)</Label>
                                <Input
                                    id="weight_kg"
                                    type="number"
                                    value={formData.weight_kg}
                                    onChange={(e) =>
                                        setFormData({ ...formData, weight_kg: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="chronic_conditions">Kronik Hastalıklar</Label>
                            <textarea
                                id="chronic_conditions"
                                value={formData.chronic_conditions}
                                onChange={(e) =>
                                    setFormData({ ...formData, chronic_conditions: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="allergies">Alerjiler</Label>
                            <textarea
                                id="allergies"
                                value={formData.allergies}
                                onChange={(e) =>
                                    setFormData({ ...formData, allergies: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="medications">Kullanılan İlaçlar</Label>
                            <textarea
                                id="medications"
                                value={formData.medications}
                                onChange={(e) =>
                                    setFormData({ ...formData, medications: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                İptal
                            </Button>
                            <Button type="submit">Oluştur</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}


