import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, User, Phone, Mail, Calendar, Ruler, Weight, FileText, DollarSign, TrendingUp, StickyNote, Heart, Pill, AlertTriangle } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    chronic_conditions: string | null;
    allergies: string | null;
    medications: string | null;
    created_at: string;
}

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
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

    useEffect(() => {
        if (id) {
            fetchClient();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Danışan bilgileri yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setClient(data.client);
                // Form data'yı doldur
                setFormData({
                    first_name: data.client.first_name || "",
                    last_name: data.client.last_name || "",
                    email: data.client.email || "",
                    phone: data.client.phone || "",
                    birth_date: data.client.birth_date ? data.client.birth_date.split("T")[0] : "",
                    gender: data.client.gender || "",
                    height_cm: data.client.height_cm?.toString() || "",
                    weight_kg: data.client.weight_kg?.toString() || "",
                    chronic_conditions: data.client.chronic_conditions || "",
                    allergies: data.client.allergies || "",
                    medications: data.client.medications || "",
                });
            }
        } catch {
            toast.error("Danışan bilgileri yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const response = await fetch(apiUrl(`api/clients/${id}`), {
                method: "PUT",
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
                throw new Error(data.message || "Danışan güncellenemedi");
            }

            toast.success("Danışan bilgileri başarıyla güncellendi");
            setIsEditDialogOpen(false);
            fetchClient();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
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

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Danışan bulunamadı</div>
            </div>
        );
    }

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const calculateBMI = () => {
        if (client.height_cm && client.weight_kg) {
            const heightInMeters = client.height_cm / 100;
            const bmi = client.weight_kg / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };

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
                        <BreadcrumbPage>
                            {client.first_name} {client.last_name}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                            {getInitials(client.first_name, client.last_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {client.first_name} {client.last_name}
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            {client.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>{client.email}</span>
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>{client.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-4 w-4" />
                    Düzenle
                </Button>
            </div>

            {/* Quick Stats */}
            {(client.height_cm || client.weight_kg || calculateBMI() || (client.birth_date && calculateAge(client.birth_date))) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {client.height_cm && (
                        <div className="bg-background border rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Ruler className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Boy</p>
                                    <p className="text-lg font-semibold">{client.height_cm} cm</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {client.weight_kg && (
                        <div className="bg-background border rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Weight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Kilo</p>
                                    <p className="text-lg font-semibold">{client.weight_kg} kg</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {calculateBMI() && (
                        <div className="bg-background border rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <div>
                                    <p className="text-xs text-muted-foreground">BMI</p>
                                    <p className="text-lg font-semibold">{calculateBMI()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {client.birth_date && calculateAge(client.birth_date) && (
                        <div className="bg-background border rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Yaş</p>
                                    <p className="text-lg font-semibold">{calculateAge(client.birth_date)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link to={`/clients/${id}/diet-plans`}>
                    <div className="group border rounded-lg p-4 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer bg-background">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Diyet Planları</p>
                                <p className="text-xs text-muted-foreground">Planları görüntüle</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to={`/clients/${id}/notes`}>
                    <div className="group border rounded-lg p-4 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer bg-background">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <StickyNote className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Notlar</p>
                                <p className="text-xs text-muted-foreground">Notları görüntüle</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to={`/clients/${id}/financial`}>
                    <div className="group border rounded-lg p-4 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer bg-background">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Finansal</p>
                                <p className="text-xs text-muted-foreground">Kayıtları görüntüle</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to={`/clients/${id}/progress`}>
                    <div className="group border rounded-lg p-4 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer bg-background">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">İlerleme</p>
                                <p className="text-xs text-muted-foreground">Kayıtları görüntüle</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Personal Info Card */}
                <div className="bg-background border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Kişisel Bilgiler</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Ad Soyad</p>
                                <p className="font-medium text-sm truncate">
                                    {client.first_name} {client.last_name}
                                </p>
                            </div>
                        </div>
                        {client.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">E-posta</p>
                                    <p className="font-medium text-sm truncate">{client.email}</p>
                                </div>
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Telefon</p>
                                    <p className="font-medium text-sm truncate">{client.phone}</p>
                                </div>
                            </div>
                        )}
                        {client.birth_date && (
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Doğum Tarihi</p>
                                    <p className="font-medium text-sm">
                                        {new Date(client.birth_date).toLocaleDateString("tr-TR")}
                                        {calculateAge(client.birth_date) && (
                                            <span className="text-muted-foreground ml-1">
                                                ({calculateAge(client.birth_date)} yaş)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                        {client.gender && (
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Cinsiyet</p>
                                    <p className="font-medium text-sm">
                                        {client.gender === "male" ? "Erkek" : "Kadın"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Health Info Card */}
                <div className="bg-background border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Heart className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Sağlık Bilgileri</h2>
                    </div>
                    <div className="space-y-3">
                        {client.height_cm && (
                            <div className="flex items-center gap-3">
                                <Ruler className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Boy</p>
                                    <p className="font-medium text-sm">{client.height_cm} cm</p>
                                </div>
                            </div>
                        )}
                        {client.weight_kg && (
                            <div className="flex items-center gap-3">
                                <Weight className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Kilo</p>
                                    <p className="font-medium text-sm">{client.weight_kg} kg</p>
                                </div>
                            </div>
                        )}
                        {client.chronic_conditions && (
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-1">Kronik Hastalıklar</p>
                                    <p className="text-xs leading-relaxed">{client.chronic_conditions}</p>
                                </div>
                            </div>
                        )}
                        {client.allergies && (
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-1">Alerjiler</p>
                                    <p className="text-xs leading-relaxed">{client.allergies}</p>
                                </div>
                            </div>
                        )}
                        {client.medications && (
                            <div className="flex items-start gap-3">
                                <Pill className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-1">Kullanılan İlaçlar</p>
                                    <p className="text-xs leading-relaxed">{client.medications}</p>
                                </div>
                            </div>
                        )}
                        {!client.height_cm && !client.weight_kg && !client.chronic_conditions && !client.allergies && !client.medications && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                                Sağlık bilgisi bulunmuyor
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Danışan Bilgilerini Düzenle</DialogTitle>
                        <DialogDescription>
                            Danışan bilgilerini güncelleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateClient} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_first_name">Ad *</Label>
                                <Input
                                    id="edit_first_name"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, first_name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_last_name">Soyad *</Label>
                                <Input
                                    id="edit_last_name"
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
                                <Label htmlFor="edit_email">E-posta</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_phone">Telefon</Label>
                                <Input
                                    id="edit_phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_birth_date">Doğum Tarihi</Label>
                                <Input
                                    id="edit_birth_date"
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, birth_date: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_gender">Cinsiyet</Label>
                                <select
                                    id="edit_gender"
                                    value={formData.gender}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gender: e.target.value })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="male">Erkek</option>
                                    <option value="female">Kadın</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_height_cm">Boy (cm)</Label>
                                <Input
                                    id="edit_height_cm"
                                    type="number"
                                    value={formData.height_cm}
                                    onChange={(e) =>
                                        setFormData({ ...formData, height_cm: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_weight_kg">Kilo (kg)</Label>
                                <Input
                                    id="edit_weight_kg"
                                    type="number"
                                    step="0.1"
                                    value={formData.weight_kg}
                                    onChange={(e) =>
                                        setFormData({ ...formData, weight_kg: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_chronic_conditions">Kronik Hastalıklar</Label>
                            <textarea
                                id="edit_chronic_conditions"
                                value={formData.chronic_conditions}
                                onChange={(e) =>
                                    setFormData({ ...formData, chronic_conditions: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_allergies">Alerjiler</Label>
                            <textarea
                                id="edit_allergies"
                                value={formData.allergies}
                                onChange={(e) =>
                                    setFormData({ ...formData, allergies: e.target.value })
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_medications">Kullanılan İlaçlar</Label>
                            <textarea
                                id="edit_medications"
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
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isUpdating}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
