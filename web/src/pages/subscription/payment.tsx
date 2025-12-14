import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";
import { CreditCard, Lock, ArrowLeft, Loader2 } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    duration: string;
    price: number;
    original_price?: number;
}

export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planId = searchParams.get("planId");
    const [fetchingPlan, setFetchingPlan] = useState(true);
    const [loadingToken, setLoadingToken] = useState(false);
    const [error, setError] = useState("");
    const [plan, setPlan] = useState<Plan | null>(null);
    const [paytrToken, setPaytrToken] = useState<string | null>(null);
    const [iframeHeight, setIframeHeight] = useState<number>(600);

    useEffect(() => {
        if (!planId) {
            toast.error("Geçersiz plan seçimi");
            navigate("/subscription");
            return;
        }

        const fetchPlan = async () => {
            try {
                setFetchingPlan(true);
                const response = await fetch(apiUrl("api/subscription/plans"), {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    const foundPlan = data.plans.find((p: Plan) => p.id === planId);
                    if (foundPlan) {
                        setPlan(foundPlan);
                    } else {
                        toast.error("Plan bulunamadı");
                        navigate("/subscription");
                    }
                } else {
                    toast.error("Plan bilgileri yüklenemedi");
                    navigate("/subscription");
                }
            } catch (error) {
                toast.error("Bir hata oluştu");
                console.error(error);
                navigate("/subscription");
            } finally {
                setFetchingPlan(false);
            }
        };

        fetchPlan();
    }, [planId, navigate]);

    // PayTR token al
    const getPaytrToken = async () => {
        if (!planId) return;

        setLoadingToken(true);
        setError("");

        try {
            const response = await fetch(apiUrl("api/payment/paytr-token"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ planId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaytrToken(data.token);
            } else {
                throw new Error(data.message || "Ödeme token'ı alınamadı");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoadingToken(false);
        }
    };

    // Plan yüklendiğinde token al
    useEffect(() => {
        if (plan && !paytrToken && !loadingToken) {
            getPaytrToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan]);

    // PayTR iframe postMessage dinleyicisi
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // PayTR iframe'den gelen mesajları dinle
            if (event.origin !== 'https://www.paytr.com') {
                return;
            }
            
            console.log('PayTR iframe mesajı:', event.data);
            
            // PayTR'den gelen mesajları işle
            if (event.data && typeof event.data === 'object') {
                // Iframe yüksekliğini ayarla
                if (event.data.type === 'setHeight' && event.data.value) {
                    const heightValue = event.data.value.replace('px', '');
                    const height = parseInt(heightValue, 10);
                    if (!isNaN(height) && height > 0) {
                        setIframeHeight(height);
                    }
                }
                
                // Ödeme durumu mesajları
                if (event.data.status === 'success') {
                    // Ödeme başarılı - PayTR kendi callback'i ile yönlendirecek
                    console.log('Ödeme başarılı');
                } else if (event.data.status === 'error') {
                    // Ödeme hatası
                    console.error('Ödeme hatası:', event.data.message);
                    setError(event.data.message || 'Ödeme işlemi sırasında bir hata oluştu');
                }
            }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    if (fetchingPlan) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <div className="text-muted-foreground">Plan bilgileri yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (!plan) {
        return null;
    }

    const planName = plan.name === 'pro' ? 'Pro' : 'Premium';
    const planPrice = Number(plan.price);
    const isYearly = plan.duration === 'yearly';
    const monthlyPrice = isYearly ? (planPrice / 12) : planPrice;

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/subscription")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Geri
                    </Button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Ödeme Bilgileri</h1>
                <p className="text-muted-foreground">
                    {planName} {isYearly ? 'Yıllık' : 'Aylık'} planını seçtiniz. Ödeme bilgilerinizi girin.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <Alert variant="destructive" className="animate-in fade-in-0">
                    <AlertTitle>Hata</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Ödeme Formu */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Güvenli Ödeme</h2>
                        <p className="text-sm text-muted-foreground">
                            Ödeme işleminizi PayTR güvenli ödeme altyapısı ile tamamlayın
                        </p>
                    </div>
                </div>
                
                <Separator />
                
                {/* Plan Özeti */}
                <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{planName} Plan</p>
                                {isYearly && (
                                    <Badge variant="secondary" className="text-xs">
                                        %20 İndirim
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {isYearly ? 'Yıllık faturalandırma' : 'Aylık faturalandırma'}
                            </p>
                            {isYearly && plan.original_price && (
                                <p className="text-xs text-muted-foreground line-through mt-1">
                                    {Math.round(Number(plan.original_price)).toLocaleString('tr-TR')} TL
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">{Math.round(planPrice).toLocaleString('tr-TR')} TL</p>
                            <p className="text-xs text-muted-foreground">
                                /{isYearly ? 'yıl' : 'ay'}
                            </p>
                            {isYearly && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Aylık: {Math.round(parseFloat(monthlyPrice)).toLocaleString('tr-TR')} TL
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* PayTR iFrame */}
                {loadingToken ? (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Ödeme sayfası hazırlanıyor...</p>
                    </div>
                ) : paytrToken ? (
                    <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                            <iframe
                                src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                                id="paytriframe"
                                name="paytriframe"
                                width="100%"
                                height={iframeHeight}
                                scrolling="no"
                                allow="payment; autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: 'none', transition: 'height 0.3s ease' }}
                                title="PayTR Ödeme Sayfası"
                                onLoad={() => {
                                    console.log('PayTR iframe yüklendi');
                                }}
                                onError={(e) => {
                                    console.error('PayTR iframe yükleme hatası:', e);
                                    setError('Ödeme sayfası yüklenirken bir hata oluştu');
                                }}
                            ></iframe>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                            <Lock className="h-4 w-4 shrink-0" />
                            <span>Ödeme bilgileriniz PayTR güvenli ödeme altyapısı ile işlenir ve saklanmaz</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                        <p className="text-muted-foreground mb-4">Ödeme sayfası yüklenemedi</p>
                        <Button onClick={getPaytrToken} disabled={loadingToken}>
                            {loadingToken ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Yükleniyor...
                                </>
                            ) : (
                                "Tekrar Dene"
                            )}
                        </Button>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/subscription")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri Dön
                    </Button>
                </div>
            </div>
        </div>
    );
}
