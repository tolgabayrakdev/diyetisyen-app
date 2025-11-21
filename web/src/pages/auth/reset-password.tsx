import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError("Token bulunamadı. Lütfen e-postanızdaki bağlantıyı kullanın.");
                setVerifying(false);
                return;
            }

            try {
                const response = await fetch(apiUrl(`api/auth/verify-reset-token?token=${token}`), {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.message?.message || data.message || "Token geçersiz veya süresi dolmuş";
                    throw new Error(errorMessage);
                }

                setTokenValid(true);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Token geçersiz veya süresi dolmuş";
                setError(errorMessage);
                setTokenValid(false);
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(apiUrl("api/auth/reset-password"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message?.message || data.message || "Bir hata oluştu";
                throw new Error(errorMessage);
            }

            setSuccess(true);
            
            // 2 saniye sonra giriş sayfasına yönlendir
            setTimeout(() => {
                navigate("/sign-in");
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Token doğrulanıyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <img 
                                src="" 
                                alt="" 
                                className="h-20 w-auto"
                            />
                        </div>
                        <h1 className="text-2xl font-semibold">Geçersiz Token</h1>
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Bu bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama bağlantısı isteyin.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Link to="/forgot-password">
                            <Button variant="outline" className="w-full">
                                Yeni Şifre Sıfırlama Bağlantısı İste
                            </Button>
                        </Link>
                        <div className="text-center">
                            <Link 
                                to="/sign-in" 
                                className="text-sm text-primary hover:underline"
                            >
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <img 
                            src="" 
                            alt="" 
                            className="h-20 w-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-semibold">Yeni Şifre Belirle</h1>
                    <p className="text-sm text-muted-foreground">
                        Yeni şifrenizi belirleyin
                    </p>
                </div>
                {success ? (
                    <div className="space-y-4">
                        <div className="p-4 text-sm bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 rounded-md border border-green-200 dark:border-green-800">
                            <p className="font-medium">Şifre başarıyla sıfırlandı!</p>
                            <p className="mt-2">
                                Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">Yeni Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="En az 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Şifrenizi tekrar girin"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                        >
                            {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
                        </Button>
                    </form>
                )}
                <div className="text-center text-sm">
                    <Link 
                        to="/sign-in" 
                        className="text-primary hover:underline"
                    >
                        Giriş sayfasına dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
