import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        type: "general",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.subject.trim()) {
            toast.error("Konu gereklidir");
            return;
        }

        if (!formData.message.trim()) {
            toast.error("Mesaj gereklidir");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(apiUrl("api/feedback"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                setFormData({
                    type: "general",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(data.message || "Bir hata oluştu");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Öneri ve İstekler</h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Platform hakkındaki düşüncelerinizi, önerilerinizi veya isteklerinizi bizimle paylaşın
                </p>
            </div>

            <div className="border rounded-lg p-4 sm:p-6 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-4">
                    DiyetKa'yı daha iyi hale getirmek için görüşleriniz bizim için çok değerli. 
                    Önerileriniz, istekleriniz veya karşılaştığınız sorunları bu form aracılığıyla bize iletebilirsiniz.
                </p>
            </div>

            {isSubmitted ? (
                <div className="border rounded-lg p-8 sm:p-12 text-center space-y-4 bg-muted/30">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-semibold">Başarıyla İletildi!</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Öneri/isteğiniz başarıyla gönderildi. İlgi ve alakanız için teşekkür ederiz.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                            En kısa sürede değerlendirip size geri dönüş yapacağız.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-4"
                    >
                        Yeni Öneri/İstek Gönder
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">İletişim Tipi *</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Tip seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">Genel Öneri/İstek</SelectItem>
                                <SelectItem value="feature">Özellik İsteği</SelectItem>
                                <SelectItem value="bug">Hata Bildirimi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Konu *</Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Örn: Yeni bir özellik önerisi"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Mesaj *</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Düşüncelerinizi, önerilerinizi veya isteklerinizi detaylı bir şekilde yazın..."
                            rows={12}
                            required
                            className="resize-y min-h-[200px]"
                        />
                        <p className="text-xs text-muted-foreground">
                            Mesajınız diyetka@gmail.com adresine gönderilecektir.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Gönder
                            </>
                        )}
                    </Button>
                </div>
            </form>
            )}
        </div>
    );
}

