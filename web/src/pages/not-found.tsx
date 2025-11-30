import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* 404 Number */}
                <div className="space-y-4">
                    <h1 className="text-9xl font-bold text-primary/20 select-none">
                        404
                    </h1>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">
                            Sayfa Bulunamadı
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto"
                        variant="default"
                    >
                        <Home className="h-4 w-4" />
                        <span>Ana Sayfaya Dön</span>
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto"
                        variant="outline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Geri Git</span>
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                        Eğer bu bir hata olduğunu düşünüyorsanız, lütfen{" "}
                        <a
                            href="mailto:diyetka@gmail.com"
                            className="text-primary hover:underline font-medium"
                        >
                            destek ekibimizle
                        </a>{" "}
                        iletişime geçin.
                    </p>
                </div>
            </div>
        </div>
    );
}
