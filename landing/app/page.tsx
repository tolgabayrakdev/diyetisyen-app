import Link from "next/link";
import type { Metadata } from "next";
import { FadeInUp, StaggerContainer, StaggerItem, Counter, ScaleOnHover } from "./components/animations";
import { FeatureCard } from "./components/feature-card";
import { AnimatedText } from "./components/animated-text";
import { StarsBackground } from "./components/stars-background";
import { MeteorRain } from "./components/meteor-rain";
import { FloatingParticles } from "./components/floating-particles";
import { AnimatedSectionBg } from "./components/animated-section-bg";
import { HealthLifestyleSection } from "./components/health-lifestyle-section";
import { FreeTrialForm } from "./components/free-trial-form";

export const metadata: Metadata = {
  title: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
  description: "Diyetisyenler için profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim. 7 gün ücretsiz deneme ile başlayın. Zamandan tasarruf edin, gelirinizi artırın.",
  keywords: [
    "diyetisyen yazılımı",
    "diyetisyen yönetim sistemi",
    "danışan yönetimi",
    "diyet planı oluşturma",
    "beslenme danışmanlığı yazılımı",
    "diyetisyen platformu",
    "ücretsiz deneme",
  ],
  openGraph: {
    title: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. 7 gün ücretsiz deneme.",
    url: "https://diyetka.com",
  },
  alternates: {
    canonical: "https://diyetka.com",
  },
};

export default function Home() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "DiyetKa'yı nasıl kullanmaya başlarım?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "7 gün ücretsiz deneme için ana sayfadaki formu doldurun veya diyetka@gmail.com adresine e-posta gönderin. Kredi kartı gerektirmez, hemen başlayabilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "DiyetKa ne kadar maliyetli?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Başlangıç planı aylık 299 TL'den başlar. Profesyonel plan 599 TL, Kurumsal plan ise özel fiyatlandırma ile sunulur. Tüm planlarda 7 gün ücretsiz deneme mevcuttur.",
        },
      },
      {
        "@type": "Question",
        name: "Verilerim güvende mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, DiyetKa KVKK uyumludur ve tüm veriler şifrelenmiş olarak saklanır. Danışan bilgileriniz %100 güvendedir.",
        },
      },
    ],
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DiyetKa",
    url: "https://diyetka.com",
    logo: "https://diyetka.com/logo.png",
    description: "Diyetisyenler için profesyonel yönetim platformu",
    contactPoint: {
      "@type": "ContactPoint",
      email: "diyetka@gmail.com",
      contactType: "Müşteri Hizmetleri",
    },
    sameAs: [
      // Sosyal medya linkleri buraya eklenecek
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <div className="space-y-0">
      {/* Hero Banner Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <StarsBackground />
        <MeteorRain />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
                <span>Danışan yönetim platformu</span>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block">Diyetisyenler İçin</span>
                <AnimatedText />
              </h1>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Danışanlarınızı kolayca yönetin, detaylı diyet planları
                oluşturun, ilerlemelerini takip edin, finansal kayıtlarınızı tutun ve işinizi büyütün.
              </p>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
                <ScaleOnHover>
                  <a
                    href="#free-trial"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                  >
                    Ücretsiz Başlayın
                    <span className="ml-2">→</span>
                  </a>
                </ScaleOnHover>
                <ScaleOnHover>
                  <Link
                    href="https://app.diyetka.com/sign-in"
                    className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-background/80 backdrop-blur-sm px-8 text-base font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    Giriş Yap
                  </Link>
                </ScaleOnHover>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.5}>
              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>7 Gün Ücretsiz</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Kredi Kartı Gerekmez</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Anında Başla</span>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StaggerItem>
              <div className="space-y-1">
                <Counter value="50+" className="text-3xl font-bold text-primary" delay={0.1} />
                <div className="text-sm text-muted-foreground">Aktif Diyetisyen</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1">
                <Counter value="500+" className="text-3xl font-bold text-primary" delay={0.2} />
                <div className="text-sm text-muted-foreground">Yönetilen Danışan</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1">
                <Counter value="1K+" className="text-3xl font-bold text-primary" delay={0.3} />
                <div className="text-sm text-muted-foreground">Oluşturulan Plan</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1">
                <Counter value="%95" className="text-3xl font-bold text-primary" delay={0.4} />
                <div className="text-sm text-muted-foreground">Memnuniyet Oranı</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 overflow-hidden">
        <AnimatedSectionBg />
        <FloatingParticles />
        <div className="relative z-10 space-y-12">
          <FadeInUp>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Neden DiyetKa?</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Diyetisyenler için tasarlanmış kapsamlı çözüm. İşinizi kolaylaştırın, zaman kazanın.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <FeatureCard
                emoji="👥"
                title="Danışan Yönetimi"
                description="Tüm danışanlarınızı tek bir yerden yönetin. Detaylı bilgiler, notlar ve dokümanlar."
                index={0}
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                emoji="📋"
                title="Diyet Planları"
                description="Zengin metin editörü ile detaylı diyet planları oluşturun. PDF yükleyebilir veya sıfırdan plan oluşturabilirsiniz."
                index={1}
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                emoji="📊"
                title="İlerleme Takibi"
                description="Danışanlarınızın ilerlemelerini görsel grafiklerle takip edin ve raporlar oluşturun."
                index={2}
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                emoji="💰"
                title="Finansal Yönetim"
                description="Gelir ve giderlerinizi takip edin. Ödeme geçmişi ve faturalandırma."
                index={3}
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                emoji="📝"
                title="Notlar & Dokümanlar"
                description="Danışanlarınızla ilgili notlar tutun ve dokümanları güvenli bir şekilde saklayın."
                index={4}
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                emoji="📈"
                title="İstatistikler"
                description="Detaylı istatistikler ve raporlarla işinizi analiz edin ve büyütün."
                index={5}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Health & Lifestyle Section */}
      <HealthLifestyleSection />

      {/* CTA Section with Gradient */}
      <div id="free-trial" className="relative overflow-hidden bg-linear-to-r from-primary/10 via-primary/5 to-background scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <FadeInUp>
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">7 Gün Ücretsiz Deneme</h2>
                <p className="text-base text-muted-foreground">
                  DiyetKa ile işinizi dijitalleştirin ve danışanlarınıza daha iyi
                  hizmet verin. Kredi kartı gerektirmez, hemen başlayın.
                </p>
              </div>
              
              <FreeTrialForm />
              
              <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
                <ScaleOnHover>
                  <Link
                    href="/pricing"
                    className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-background/80 backdrop-blur-sm px-8 text-base font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    Fiyatları Görün
                  </Link>
                </ScaleOnHover>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
      </div>
    </>
  );
}
