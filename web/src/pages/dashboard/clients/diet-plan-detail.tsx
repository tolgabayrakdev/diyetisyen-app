import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    FileText,
    Edit,
    Plus,
    Trash2,
    File,
    Download,
    X,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DietPlanPDFReport } from "@/components/diet-plan-pdf-report";
import { DietPlanTemplateView } from "@/components/diet-plan-template-view";

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    start_date: string | null;
    end_date: string | null;
    pdf_url?: string | null;
    created_at: string;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    chronic_conditions?: string | null;
    allergies?: string | null;
    medications?: string | null;
}

interface Dietitian {
    first_name: string;
    last_name: string;
}

export default function DietPlanDetailPage() {
    const { id: clientId, planId } = useParams<{ id: string; planId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<DietPlan | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [dietitian, setDietitian] = useState<Dietitian | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
    const [isCreateMethodDialogOpen, setIsCreateMethodDialogOpen] = useState(false);
    const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [isDeletingPdf, setIsDeletingPdf] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        content: "",
        start_date: "",
        end_date: "",
    });
    const [contentData, setContentData] = useState("");

    useEffect(() => {
        if (clientId && planId) {
            fetchClient();
            fetchDietPlan();
            fetchDietitian();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId, planId]);

    const fetchClient = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${clientId}`), {
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

    const fetchDietPlan = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Plan yüklenemedi");
            }

            const data = await response.json();
            if (data.success) {
                setPlan(data.dietPlan);
                setContentData(data.dietPlan.content || "");
                setEditFormData({
                    title: data.dietPlan.title || "",
                    description: data.dietPlan.description || "",
                    content: data.dietPlan.content || "",
                    start_date: data.dietPlan.start_date || "",
                    end_date: data.dietPlan.end_date || "",
                });
            }
        } catch {
            toast.error("Plan yüklenirken bir hata oluştu");
            navigate(`/clients/${clientId}/diet-plans`);
        } finally {
            setLoading(false);
        }
    };

    const fetchDietitian = async () => {
        try {
            const response = await fetch(apiUrl("api/auth/me"), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    setDietitian({
                        first_name: data.user.first_name || "",
                        last_name: data.user.last_name || "",
                    });
                }
            }
        } catch (error) {
            console.error("Dietitian fetch error:", error);
        }
    };

    const handleCreateContent = () => {
        setIsCreateMethodDialogOpen(true);
    };

    const handleSelectCreateMethod = (method: "text" | "pdf") => {
        setIsCreateMethodDialogOpen(false);
        if (method === "text") {
            setContentData(plan?.content || "");
            setIsContentDialogOpen(true);
        } else if (method === "pdf") {
            setPdfFile(null);
            setIsPdfDialogOpen(true);
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

    const handleUploadPdf = async () => {
        if (!pdfFile) {
            toast.error("Lütfen bir PDF dosyası seçin");
            return;
        }

        setIsUploadingPdf(true);
        try {
            // PDF'i base64'e çevir
            const pdfBase64 = await fileToBase64(pdfFile);

            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    pdf_base64: pdfBase64,
                    pdf_file_name: pdfFile.name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "PDF yüklenemedi");
            }

            toast.success("PDF başarıyla yüklendi");
            setIsPdfDialogOpen(false);
            setPdfFile(null);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsUploadingPdf(false);
        }
    };

    const handleDeletePdf = async () => {
        if (!confirm("PDF dosyasını silmek istediğinizden emin misiniz?")) {
            return;
        }

        setIsDeletingPdf(true);
        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    pdf_url: null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "PDF silinemedi");
            }

            toast.success("PDF başarıyla silindi");
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsDeletingPdf(false);
        }
    };

    const handleSaveContent = async () => {
        setIsSavingContent(true);

        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    content: contentData || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "İçerik kaydedilemedi");
            }

            toast.success("Diyet planı içeriği başarıyla kaydedildi");
            setIsContentDialogOpen(false);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsSavingContent(false);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(apiUrl(`api/diet-plans/${planId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: editFormData.title,
                    description: editFormData.description || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Plan güncellenemedi");
            }

            toast.success("Plan başarıyla güncellendi");
            setIsEditDialogOpen(false);
            fetchDietPlan();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
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

    if (!plan) {
        return null;
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
                            <Link to={`/clients/${clientId}`}>
                                {client ? `${client.first_name} ${client.last_name}` : "Danışan"}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/clients/${clientId}/diet-plans`}>Diyet Planları</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>{plan.title}</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
                    {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* İçerik yoksa - İçerik oluştur butonu */}
                    {!plan.content && !plan.pdf_url && (
                        <Button onClick={handleCreateContent} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Diyet Planı İçeriği Oluştur
                        </Button>
                    )}
                    
                    
                    {/* PDF raporu sadece metin içeriği varsa göster, PDF içeriği varsa gösterme */}
                    {plan && client && dietitian && plan.content && !plan.pdf_url && (
                        <DietPlanPDFReport plan={plan} client={client} dietitian={dietitian} />
                    )}
                </div>
            </div>

            {/* Plan PDF */}
            {plan.pdf_url && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <File className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Diyet Planı PDF</h2>
                                <p className="text-sm text-muted-foreground">
                                    Planın PDF dosyası
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleDeletePdf}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            disabled={isDeletingPdf}
                        >
                            {isDeletingPdf ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Siliniyor...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    <span>PDF'i Sil</span>
                                </>
                            )}
                        </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <File className="h-6 w-6 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">PDF Dosyası</p>
                                        <p className="text-xs text-muted-foreground">Yüklenmiş PDF dosyası</p>
                                    </div>
                                </div>
                                <a
                                    href={plan.pdf_url.startsWith('http://') || plan.pdf_url.startsWith('https://') ? plan.pdf_url : apiUrl(plan.pdf_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:underline"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>PDF'i Görüntüle/İndir</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Content - Template View or Text Editor */}
            {plan.content && (
            <div className="space-y-6">
                {/* Try to render as template first */}
                {(() => {
                    const templateView = <DietPlanTemplateView content={plan.content} startDate={plan.start_date} endDate={plan.end_date} />;
                    if (templateView) {
                        // Check if it's a valid JSON template
                        try {
                            const parsed = JSON.parse(plan.content);
                            if (parsed.templateId) {
                                return templateView;
                            }
                        } catch {
                            // Not JSON, show legacy view
                        }
                    }
                    
                    // Legacy text content view
                    return (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">Diyet Planı İçeriği</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Planın metin editörü ile oluşturulmuş içeriği
                                    </p>
                                </div>
                                <Button onClick={() => handleSelectCreateMethod("text")} variant="outline" size="sm" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    İçeriği Düzenle
                                </Button>
                            </div>
                            
                            <Separator />

                            <div className="border rounded-lg p-6 space-y-4">
                                <div 
                                    className="prose prose-sm sm:prose-base max-w-none line-clamp-6 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: plan.content }}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setContentData(plan.content || "");
                                            setIsContentDialogOpen(true);
                                        }}
                                        className="text-sm hover:underline flex items-center gap-1"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Tamamını Gör
                                    </button>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
            )}

            {/* Empty State */}
            {!plan.content && !plan.pdf_url && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Diyet Planı İçeriği</h2>
                            <p className="text-sm text-muted-foreground">
                                Planın detaylı içeriği
                            </p>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="rounded-lg bg-muted/50 p-12 text-center space-y-4">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">Henüz içerik yok</h3>
                        <p className="text-muted-foreground mb-4">
                            Bu plan için henüz içerik eklenmemiş. Metin editörü kullanarak veya PDF yükleyerek içerik oluşturabilirsiniz.
                        </p>
                        <Button onClick={handleCreateContent} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Diyet Planı İçeriği Oluştur
                        </Button>
                    </div>
                    </div>
                )}

            {/* Create Method Selection Dialog */}
            <Dialog open={isCreateMethodDialogOpen} onOpenChange={setIsCreateMethodDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>İçerik Oluşturma Yöntemi Seçin</DialogTitle>
                        <DialogDescription>
                            Diyet planı içeriğini nasıl oluşturmak istersiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <button
                            onClick={() => handleSelectCreateMethod("text")}
                            className="h-auto p-6 flex flex-col items-center gap-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer text-left w-full"
                        >
                            <FileText className="h-8 w-8 shrink-0" />
                            <div className="text-center w-full space-y-1">
                                <div className="font-semibold text-base">Metin Editörü</div>
                                <div className="text-sm text-muted-foreground mt-1 wrap-break-words px-2">
                                    Zengin metin editörü ile Word benzeri formatlamalar yapabilirsiniz
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleSelectCreateMethod("pdf")}
                            className="h-auto p-6 flex flex-col items-center gap-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer text-left w-full"
                        >
                            <File className="h-8 w-8 shrink-0" />
                            <div className="text-center w-full space-y-1">
                                <div className="font-semibold text-base">PDF Yükle</div>
                                <div className="text-sm text-muted-foreground mt-1 wrap-break-words px-2">
                                    Hazır PDF dosyası yükleyerek diyet planını paylaşın
                                </div>
                            </div>
                        </button>
            </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateMethodDialogOpen(false)}>
                            İptal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Content Creation/Edit Dialog - Fullscreen */}
            <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogContent 
                    className="max-w-none! w-screen! h-screen! max-h-screen! m-0! p-0! rounded-none overflow-hidden flex flex-col translate-x-0! translate-y-0! top-0! left-0! right-0! bottom-0! inset-0!"
                    showCloseButton={true}
                >
                    <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                        <DialogTitle>Diyet Planı İçeriği</DialogTitle>
                        <DialogDescription>
                            Yeni bir belge oluşturun. Haftanın günlerini, öğünleri ve tüm detayları istediğiniz gibi formatlayabilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden px-6 py-4 min-h-0 flex flex-col">
                        <RichTextEditor
                            content={contentData}
                            onChange={(content) => setContentData(content)}
                            placeholder="Diyet planınızı buraya yazın. Başlık, liste ve formatlamalar ekleyebilirsiniz..."
                        />
                    </div>
                    <DialogFooter className="px-6 pb-6 pt-4 border-t shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsContentDialogOpen(false)}
                            disabled={isSavingContent}
                        >
                            İptal
                        </Button>
                        <Button onClick={handleSaveContent} disabled={isSavingContent}>
                            {isSavingContent ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PDF Upload Dialog */}
            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>PDF Yükle</DialogTitle>
                        <DialogDescription>
                            Diyet planı için PDF dosyası yükleyin. Maksimum dosya boyutu 10MB'dır.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {!pdfFile ? (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <Label htmlFor="pdf-upload" className="cursor-pointer">
                                    <span className="text-sm font-medium text-primary hover:underline">
                                        PDF dosyası seçin
                                    </span>
                                    <input
                                        id="pdf-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </Label>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Sadece PDF dosyaları kabul edilir (maks. 10MB)
                                </p>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <File className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium text-sm">{pdfFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleRemovePdf}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsPdfDialogOpen(false);
                                setPdfFile(null);
                            }}
                            disabled={isUploadingPdf}
                        >
                            İptal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUploadPdf}
                            disabled={!pdfFile || isUploadingPdf}
                        >
                            {isUploadingPdf ? "Yükleniyor..." : "Yükle"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Planı Düzenle</DialogTitle>
                        <DialogDescription>
                            Diyet planının başlık ve açıklamasını düzenleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_title">Başlık *</Label>
                                <input
                                    id="edit_title"
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, title: e.target.value })
                                    }
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Örn: Kilo Verme Planı"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_description">Açıklama</Label>
                                <textarea
                                    id="edit_description"
                                    value={editFormData.description}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                    }
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Plan hakkında kısa açıklama..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSaving}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
