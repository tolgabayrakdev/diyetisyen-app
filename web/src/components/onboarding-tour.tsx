import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { TourProvider, useTour } from "@reactour/tour";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import "@reactour/tour/dist/index.css";

const steps = [
    {
        selector: '[data-tour="welcome"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">DiyetKa'ya Hoş Geldiniz! 🎉</h3>
                <p className="text-sm">
                    DiyetKa, diyetisyenler için özel olarak tasarlanmış bir danışan yönetim sistemidir.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li>Danışanlarınızı ekleyebilir ve yönetebilirsiniz</li>
                    <li>Diyet planları oluşturabilirsiniz</li>
                    <li>Notlar tutabilir ve finansal kayıtlarınızı yönetebilirsiniz</li>
                    <li>Beslenme hesaplayıcıları ile hızlı hesaplamalar yapabilirsiniz</li>
                    <li>Kendi besin veritabanınızı oluşturabilirsiniz</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="dashboard-stats"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Ana Sayfa (Dashboard)</h3>
                <p className="text-sm">
                    Ana sayfada sisteminizin genel durumunu görebilirsiniz:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li><strong>Toplam Danışan:</strong> Aktif danışan sayınız</li>
                    <li><strong>Diyet Planları:</strong> Oluşturduğunuz planlar</li>
                    <li><strong>Notlar:</strong> Kaydettiğiniz notlar</li>
                    <li><strong>Finansal Kayıt:</strong> Toplam finansal işlemler</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="sidebar-clients"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Danışanlar</h3>
                <p className="text-sm">
                    Danışanlar bölümünden tüm danışanlarınızı görüntüleyebilir ve yeni danışan ekleyebilirsiniz.
                </p>
                <p className="text-sm mt-2">
                    Her danışan için detaylı bilgiler, diyet planları, notlar, finansal kayıtlar ve ilerleme takibi yapabilirsiniz.
                </p>
            </div>
        ),
    },
    {
        selector: '[data-tour="sidebar-financial"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Finansal Kayıtlar</h3>
                <p className="text-sm">
                    Finansal Kayıtlar bölümünden tüm gelir ve giderlerinizi takip edebilirsiniz.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li>Her danışan için ayrı finansal kayıtlar oluşturabilirsiniz</li>
                    <li>Ödemeleri ve faturaları yönetebilirsiniz</li>
                    <li>Toplam gelir, gider ve kâr bilgilerinizi görebilirsiniz</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="sidebar-calculator"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Beslenme Hesaplayıcıları</h3>
                <p className="text-sm">
                    Beslenme hesaplayıcıları ile danışanlarınız için hızlı hesaplamalar yapabilirsiniz:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li><strong>BMI:</strong> Vücut kitle indeksi hesaplama</li>
                    <li><strong>BMR/TDEE:</strong> Bazal metabolizma ve günlük kalori ihtiyacı</li>
                    <li><strong>Makro Besinler:</strong> Protein, karbonhidrat, yağ dağılımı</li>
                    <li><strong>Su İhtiyacı:</strong> Günlük su tüketim hesaplama</li>
                    <li><strong>Protein İhtiyacı:</strong> Hedefe göre protein hesaplama</li>
                    <li><strong>Kalori Açığı/Fazlası:</strong> Kilo verme/alma planı</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="sidebar-foods"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Besin Veritabanı</h3>
                <p className="text-sm">
                    Kendi besin veritabanınızı oluşturun ve yönetin:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li>Kategorilere göre besinleri organize edin</li>
                    <li>Her besin için detaylı besin değerlerini kaydedin</li>
                    <li>Esnek birim sistemi (100g, 1 adet, 100ml, vb.)</li>
                    <li>Diyet planlarınızda kullanmak için besinleri hazır tutun</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="sidebar-activity"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Aktivite Kayıtları</h3>
                <p className="text-sm">
                    Sistemde yaptığınız tüm işlemlerin kaydını buradan görebilirsiniz.
                </p>
                <p className="text-sm mt-2">
                    Hangi danışan için ne zaman ne yaptığınızı kolayca takip edebilirsiniz.
                </p>
            </div>
        ),
    },
    {
        selector: '[data-tour="user-menu"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Hesap Ayarları</h3>
                <p className="text-sm">
                    Sağ alt köşedeki hesap menüsünden:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li>Hesap ayarlarınıza erişebilirsiniz</li>
                    <li>Hesabınızdan çıkış yapabilirsiniz</li>
                </ul>
            </div>
        ),
    },
    {
        selector: '[data-tour="welcome"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Hazırsınız! 🚀</h3>
                <p className="text-sm">
                    Artık DiyetKa'yı kullanmaya hazırsınız!
                </p>
                <p className="text-sm mt-2">
                    Herhangi bir sorunuz olursa, hesap menüsünden ayarlara erişebilirsiniz.
                </p>
                <p className="text-sm font-medium mt-2">İyi çalışmalar!</p>
            </div>
        ),
    },
];

function OnboardingTourContent() {
    const { setIsOpen, currentStep } = useTour();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        if (hasChecked) return;
        
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        const shouldShowOnboarding = localStorage.getItem('show_onboarding') === 'true';
        
        // Eğer onboarding tamamlanmışsa, flag'i kaldır
        if (onboardingCompleted) {
            localStorage.removeItem('show_onboarding');
            setTimeout(() => setHasChecked(true), 0);
            return;
        }
        
        // Sadece show_onboarding flag'i set edildiğinde göster
        // Bu flag sadece deneme başlatıldığında veya ödeme yapıldığında set edilir
        if (shouldShowOnboarding) {
            // Ana sayfaya yönlendir
            if (location.pathname !== '/') {
                navigate('/');
            }
            // Kısa bekleme sonrası tour'u başlat
            setTimeout(() => {
                setIsOpen(true);
                setHasChecked(true);
            }, 500);
        } else {
            setTimeout(() => setHasChecked(true), 0);
        }
    }, [navigate, location.pathname, setIsOpen, hasChecked]);

    // Step değişikliklerinde sayfa yönlendirmeleri
    useEffect(() => {
        // Step 1: Dashboard stats (zaten ana sayfada)
        if (currentStep === 1 && location.pathname !== '/') {
            navigate('/');
        }
        // Step 2: Clients
        if (currentStep === 2 && location.pathname !== '/clients') {
            navigate('/clients');
        }
        // Step 3: Financial
        if (currentStep === 3 && location.pathname !== '/financial') {
            navigate('/financial');
        }
        // Step 4: Calculator
        if (currentStep === 4 && location.pathname !== '/calculator') {
            navigate('/calculator');
        }
        // Step 5: Foods
        if (currentStep === 5 && location.pathname !== '/foods') {
            navigate('/foods');
        }
        // Step 6: Activity
        if (currentStep === 6 && location.pathname !== '/activity-logs') {
            navigate('/activity-logs');
        }
        // Step 7: User menu (ana sayfaya dön)
        if (currentStep === 7 && location.pathname !== '/') {
            navigate('/');
        }
        // Step 8: Complete (ana sayfada)
        if (currentStep === 8 && location.pathname !== '/') {
            navigate('/');
        }
    }, [currentStep, navigate, location.pathname]);

    return null;
}

export function OnboardingTour() {
    const { theme } = useTheme();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            const root = document.documentElement;
            setIsDark(root.classList.contains('dark'));
        };

        checkDarkMode();
        
        // Theme değişikliklerini dinle
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, [theme]);

    return (
        <TourProvider
            steps={steps}
            styles={{
                popover: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: isDark 
                        ? 'oklch(0.2795 0.0368 260.0310)' // --card dark
                        : '#ffffff',
                    color: isDark 
                        ? 'oklch(0.9288 0.0126 255.5078)' // --card-foreground dark
                        : 'oklch(0.2795 0.0368 260.0310)', // --foreground light
                    border: `1px solid ${isDark 
                        ? 'oklch(0.4461 0.0263 256.8018)' // --border dark
                        : 'oklch(0.8717 0.0093 258.3382)'}`, // --border light
                    boxShadow: isDark
                        ? '0px 4px 8px -1px rgba(0, 0, 0, 0.3), 0px 2px 4px -2px rgba(0, 0, 0, 0.2)'
                        : '0px 4px 8px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
                }),
                maskArea: (base) => ({ 
                    ...base, 
                    rx: 8,
                }),
                badge: (base) => ({ 
                    ...base, 
                    left: 'auto', 
                    right: '-0.8125em',
                    backgroundColor: isDark
                        ? 'oklch(0.6801 0.1583 276.9349)' // --primary dark
                        : 'oklch(0.5854 0.2041 277.1173)', // --primary light
                    color: isDark
                        ? 'oklch(0.2077 0.0398 265.7549)' // --primary-foreground dark
                        : '#ffffff',
                }),
                controls: (base) => ({
                    ...base,
                    color: isDark 
                        ? 'oklch(0.9288 0.0126 255.5078)' // --foreground dark
                        : 'oklch(0.2795 0.0368 260.0310)', // --foreground light
                }),
                close: (base) => ({
                    ...base,
                    color: isDark 
                        ? 'oklch(0.9288 0.0126 255.5078)' // --foreground dark
                        : 'oklch(0.2795 0.0368 260.0310)', // --foreground light
                }),
            }}
            onClickMask={({ currentStep, steps, setIsOpen }) => {
                // Son adımda mask'e tıklanınca kapat
                if (steps && currentStep === steps.length - 1) {
                    localStorage.setItem('onboarding_completed', 'true');
                    localStorage.removeItem('show_onboarding');
                    setIsOpen(false);
                }
            }}
            afterOpen={(target) => {
                // Element görünür hale geldiğinde scroll yap
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }}
            prevButton={({ currentStep, setCurrentStep }: { currentStep: number; setCurrentStep: (step: number) => void }) => {
                if (currentStep === 0) return null;
                return (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                        style={{
                            backgroundColor: isDark 
                                ? 'oklch(0.3351 0.0331 260.9120)' // --secondary dark
                                : 'oklch(0.9276 0.0058 264.5313)', // --secondary light
                            color: isDark
                                ? 'oklch(0.8717 0.0093 258.3382)' // --secondary-foreground dark
                                : 'oklch(0.3729 0.0306 259.7328)', // --secondary-foreground light
                        }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Geri
                    </button>
                );
            }}
            nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }: { currentStep: number; stepsLength: number; setCurrentStep: (step: number) => void; setIsOpen: (open: boolean) => void }) => {
                const isLastStep = currentStep === stepsLength - 1;
                return (
                    <button
                        onClick={() => {
                            if (isLastStep) {
                                localStorage.setItem('onboarding_completed', 'true');
                                localStorage.removeItem('show_onboarding');
                                setIsOpen(false);
                            } else {
                                setCurrentStep(currentStep + 1);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium"
                        style={{
                            backgroundColor: isDark
                                ? 'oklch(0.6801 0.1583 276.9349)' // --primary dark
                                : 'oklch(0.5854 0.2041 277.1173)', // --primary light
                            color: isDark
                                ? 'oklch(0.2077 0.0398 265.7549)' // --primary-foreground dark
                                : '#ffffff',
                        }}
                    >
                        {isLastStep ? 'Bitir' : (
                            <>
                                İleri
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                );
            }}
        >
            <OnboardingTourContent />
        </TourProvider>
    );
}

