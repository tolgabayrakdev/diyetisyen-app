import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function PaymentFailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const merchantOid = searchParams.get("merchant_oid");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (merchantOid) {
            toast.error("Ödeme işlemi tamamlanamadı");
            setLoading(false);
        } else {
            navigate("/subscription");
        }
    }, [merchantOid, navigate]);

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
        <div className="flex items-center justify-center min-h-[500px] p-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6">
                        <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Ödeme Tamamlanamadı</h1>
                    <p className="text-muted-foreground">
                        Ödeme işleminiz sırasında bir hata oluştu. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/subscription")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Planları Görüntüle
                    </Button>
                    <Button
                        onClick={() => navigate("/subscription")}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Tekrar Dene
                    </Button>
                </div>
            </div>
        </div>
    );
}

