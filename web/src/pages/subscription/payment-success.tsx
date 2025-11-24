import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";

interface Subscription {
    id: string;
    status: string;
    plan_name: string;
    plan_duration: string;
    start_date: string;
    end_date: string;
}

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const merchantOid = searchParams.get("merchant_oid");
    const [loading, setLoading] = useState(true);
    const [checkingSubscription, setCheckingSubscription] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 10; // 10 deneme (toplam ~10 saniye)

    // Subscription durumunu kontrol et
    const checkSubscription = async () => {
        try {
            const response = await fetch(apiUrl("api/subscription/"), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.subscription) {
                    setSubscription(data.subscription);
                    setCheckingSubscription(false);
                    setLoading(false);
                    toast.success("Aboneliğiniz başarıyla aktif edildi!");
                    // Onboarding'i tetikle
                    localStorage.setItem('show_onboarding', 'true');
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    };

    // Ödeme doğrulama ve subscription oluşturma
    const verifyPayment = useCallback(async () => {
        if (!merchantOid) return false;

        try {
            const response = await fetch(apiUrl("api/payment/verify-payment"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ merchantOid }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.subscription) {
                    setSubscription(data.subscription);
                    setCheckingSubscription(false);
                    setLoading(false);
                    toast.success("Aboneliğiniz başarıyla aktif edildi!");
                    localStorage.setItem('show_onboarding', 'true');
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }, [merchantOid]);

    useEffect(() => {
        if (!merchantOid) {
            toast.error("Geçersiz ödeme işlemi");
            navigate("/subscription");
            return;
        }

        // İlk kontrolü hemen yap
        const verifySubscription = async () => {
            // Önce mevcut subscription'ı kontrol et
            let found = await checkSubscription();
            
            if (found) {
                return;
            }

            // Subscription yoksa, ödeme doğrulama ve subscription oluşturma dene
            found = await verifyPayment();

            if (!found) {
                // Hala bulunamadıysa birkaç kez daha dene (callback gelebilir)
                for (let i = 0; i < maxRetries; i++) {
                    setRetryCount(i + 1);
                    found = await checkSubscription();
                    
                    if (found) {
                        break;
                    }
                    
                    // Son deneme değilse bekle
                    if (i < maxRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
                    }
                }
            }

            if (!found) {
                // Subscription henüz aktif olmamış olabilir, ama ödeme başarılı
                setCheckingSubscription(false);
                setLoading(false);
                toast.success("Ödeme başarıyla tamamlandı! Aboneliğiniz kısa süre içinde aktif edilecektir.");
            }
        };

        verifySubscription();
    }, [merchantOid, navigate, verifyPayment]);

    if (loading || checkingSubscription) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="text-muted-foreground">
                        {checkingSubscription 
                            ? `Abonelik durumu kontrol ediliyor... (${retryCount}/${maxRetries})`
                            : "Yükleniyor..."
                        }
                    </div>
                </div>
            </div>
        );
    }

    const planName = subscription?.plan_name === 'pro' ? 'Pro' : subscription?.plan_name === 'premium' ? 'Premium' : subscription?.plan_name || 'Plan';
    const isYearly = subscription?.plan_duration === 'yearly';

    return (
        <div className="flex items-center justify-center min-h-[500px] p-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
                        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Ödeme Başarılı!</h1>
                    {subscription ? (
                        <>
                            <p className="text-muted-foreground">
                                <strong>{planName}</strong> {isYearly ? 'Yıllık' : 'Aylık'} planınız başarıyla aktif edildi.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Artık tüm özelliklere erişebilirsiniz.
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            Ödeme başarıyla tamamlandı! Aboneliğiniz kısa süre içinde aktif edilecektir.
                        </p>
                    )}
                </div>
                <div className="pt-4">
                    <Button onClick={() => navigate("/")} className="gap-2">
                        <Home className="h-4 w-4" />
                        Ana Sayfaya Dön
                    </Button>
                </div>
            </div>
        </div>
    );
}

