import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Search, Trash2, Eye, Users, Calendar, Flame, FileText, Upload, X, File } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DietTemplate {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    total_calories: number | null;
    duration_days: number | null;
    pdf_url: string | null;
    is_active: boolean;
    meal_count: number;
    created_at: string;
    updated_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    kilo_verme: "Kilo Verme",
    kilo_alma: "Kilo Alma",
    saglikli_beslenme: "Sağlıklı Beslenme",
    sporcu_beslenmesi: "Sporcu Beslenmesi",
    diyabet: "Diyabet",
    vegan: "Vegan",
    ketojenik: "Ketojenik",
};

const CATEGORY_COLORS: Record<string, string> = {
    kilo_verme: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    kilo_alma: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    saglikli_beslenme: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    sporcu_beslenmesi: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    diyabet: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    vegan: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    ketojenik: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

export default function DietTemplatesPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<DietTemplate[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        total_calories: "",
        duration_days: "",
        is_active: true,
    });
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    useEffect(() => {
        fetchTemplates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, categoryFilter]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) {
                params.append("search", searchTerm);
            }
            if (categoryFilter !== "all") {
                params.append("category", categoryFilter);
            }

            const response = await fetch(
                apiUrl(`api/diet-templates?${params.toString()}`),
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Şablonlar yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setTemplates(data.templates || []);
            }
        } catch {
            toast.error("Şablonlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Lütfen sadece PDF dosyası yükleyin");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error("PDF dosyası 10MB'dan büyük olamaz");
                return;
            }
            setPdfFile(file);
        }
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCreateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            // PDF'i base64'e çevir
            let pdfBase64 = null;
            let pdfFileName = null;
            if (pdfFile) {
                pdfBase64 = await fileToBase64(pdfFile);
                pdfFileName = pdfFile.name;
            }

            const response = await fetch(apiUrl("api/diet-templates"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || null,
                    category: formData.category || null,
                    total_calories: formData.total_calories ? parseFloat(formData.total_calories) : null,
                    duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
                    is_active: formData.is_active,
                    pdf_base64: pdfBase64,
                    pdf_file_name: pdfFileName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Şablon oluşturulamadı");
            }

            toast.success("Diyet şablonu başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                title: "",
                description: "",
                category: "",
                total_calories: "",
                duration_days: "",
                is_active: true,
            });
            setPdfFile(null);
            fetchTemplates();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (!confirm("Bu şablonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            return;
        }

        setIsDeleting(templateId);
        try {
            const response = await fetch(apiUrl(`api/diet-templates/${templateId}`), {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Şablon silinemedi");
            }

            toast.success("Şablon başarıyla silindi");
            fetchTemplates();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(null);
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
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Diyet Şablonları</h1>
                    <p className="text-sm text-muted-foreground">
                        Profesyonel diyet listeleri oluşturun ve danışanlarınıza atayın
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Şablon
                </Button>
            </div>

            {/* Filters Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Filtrele ve Ara</h2>
                        <p className="text-sm text-muted-foreground">
                            Şablonları kategori ve arama terimine göre filtreleyin
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Şablon ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Kategoriler</SelectItem>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Templates List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Şablonlar</h2>
                        <p className="text-sm text-muted-foreground">
                            {templates.length === 0 
                                ? "Henüz şablon oluşturulmadı"
                                : `${templates.length} şablon bulundu`
                            }
                        </p>
                    </div>
                </div>
                
                <Separator />

                {templates.length === 0 ? (
                    <div className="rounded-lg bg-muted/50 p-12 text-center space-y-4">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">Henüz şablon yok</h3>
                        <p className="text-muted-foreground">
                            İlk diyet şablonunuzu oluşturarak başlayın
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Şablon Oluştur
                        </Button>
                    </div>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Başlık</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Kalori</TableHead>
                                    <TableHead>Süre</TableHead>
                                    <TableHead>Öğün</TableHead>
                                    <TableHead>PDF</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template) => (
                                    <TableRow key={template.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/diet-templates/${template.id}`)}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div className="font-semibold">{template.title}</div>
                                                {template.description && (
                                                    <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                        {template.description}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {template.category ? (
                                                <Badge
                                                    className={CATEGORY_COLORS[template.category] || "bg-gray-100 text-gray-800"}
                                                >
                                                    {CATEGORY_LABELS[template.category] || template.category}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {template.total_calories ? (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Flame className="h-4 w-4 text-muted-foreground" />
                                                    <span>{template.total_calories} kcal</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {template.duration_days ? (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{template.duration_days} gün</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{template.meal_count}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {template.pdf_url ? (
                                                <a
                                                    href={template.pdf_url.startsWith('http://') || template.pdf_url.startsWith('https://') ? template.pdf_url : apiUrl(template.pdf_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                                >
                                                    <File className="h-4 w-4" />
                                                    <span>PDF</span>
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {template.is_active ? (
                                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                                    Aktif
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Pasif</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/diet-templates/${template.id}`)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                    disabled={isDeleting === template.id}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    {isDeleting === template.id ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Yeni Diyet Şablonu</DialogTitle>
                        <DialogDescription>
                            Profesyonel bir diyet listesi şablonu oluşturun
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTemplate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Başlık *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Örn: Kilo Verme Programı - 1200 Kalori"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Şablon hakkında açıklama..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, category: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration_days">Süre (Gün)</Label>
                                    <Input
                                        id="duration_days"
                                        type="number"
                                        value={formData.duration_days}
                                        onChange={(e) =>
                                            setFormData({ ...formData, duration_days: e.target.value })
                                        }
                                        placeholder="Örn: 30"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_calories">Günlük Toplam Kalori</Label>
                                <Input
                                    id="total_calories"
                                    type="number"
                                    value={formData.total_calories}
                                    onChange={(e) =>
                                        setFormData({ ...formData, total_calories: e.target.value })
                                    }
                                    placeholder="Örn: 1200"
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pdf_file">PDF Dosyası (Opsiyonel)</Label>
                                {!pdfFile ? (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Upload className="h-10 w-10 text-muted-foreground" />
                                            <div className="text-center">
                                                <Label
                                                    htmlFor="pdf_file"
                                                    className="cursor-pointer text-primary hover:underline"
                                                >
                                                    PDF dosyası seçin
                                                </Label>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    veya sürükle bırak
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Maksimum 10MB
                                                </p>
                                            </div>
                                            <Input
                                                id="pdf_file"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <File className="h-8 w-8 text-red-600" />
                                            <div>
                                                <p className="text-sm font-medium">{pdfFile.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemovePdf}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    id="pdf_file_hidden"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    "Oluştur"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

