import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, StickyNote } from "lucide-react";
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

interface Note {
    id: string;
    note_type: string | null;
    content: string;
    created_at: string;
}

export default function ClientNotesPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        note_type: "",
        content: "",
    });

    useEffect(() => {
        if (id) {
            fetchClient();
            fetchNotes();
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

    const fetchNotes = async () => {
        try {
            const response = await fetch(apiUrl(`api/clients/${id}/notes`), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setNotes(data.notes || []);
                }
            }
        } catch {
            toast.error("Notlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const response = await fetch(apiUrl(`api/clients/${id}/notes`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    note_type: formData.note_type || null,
                    content: formData.content,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Not oluşturulamadı");
            }

            toast.success("Not başarıyla oluşturuldu");
            setIsCreateDialogOpen(false);
            setFormData({
                note_type: "",
                content: "",
            });
            fetchNotes();
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
                <BreadcrumbList className="flex-wrap">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/clients">Danışanlar</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/clients/${id}`} className="truncate max-w-[150px] sm:max-w-none">
                                {client ? `${client.first_name} ${client.last_name}` : "Danışan"}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Notlar</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Notlar</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                        {client && `${client.first_name} ${client.last_name} - `}Notları yönetin
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2 w-full sm:w-auto shrink-0">
                    <Plus className="h-4 w-4" />
                    Yeni Not
                </Button>
            </div>

            {/* Notes List */}
            {notes.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <StickyNote className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz not yok</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        İlk Notu Oluştur
                    </Button>
                </div>
            ) : (
                <div className="space-y-2 sm:space-y-3">
                    {notes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-2.5 sm:p-3">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 flex-1">
                                    {note.note_type && (
                                        <Badge variant="outline" className="text-xs shrink-0">{note.note_type}</Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground truncate">
                                        {new Date(note.created_at).toLocaleDateString("tr-TR", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                            <p className="whitespace-pre-wrap text-xs leading-relaxed break-words">{note.content}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="w-[95vw] sm:w-full">
                    <DialogHeader>
                        <DialogTitle>Yeni Not</DialogTitle>
                        <DialogDescription>
                            Danışan için yeni bir not oluşturun.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="note_type">Not Tipi</Label>
                            <Input
                                id="note_type"
                                value={formData.note_type}
                                onChange={(e) =>
                                    setFormData({ ...formData, note_type: e.target.value })
                                }
                                placeholder="Örn: Genel, Önemli, Randevu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">İçerik *</Label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                required
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Not içeriğini yazın..."
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
