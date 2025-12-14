import Link from "next/link";
import type { Metadata } from "next";
import { FeatureCard } from "./components/feature-card";
import { AnimatedText } from "./components/animated-text";
import { HealthLifestyleSection } from "./components/health-lifestyle-section";
import { LightStarsBackground } from "./components/light-stars-background";
import { FeatureShowcase } from "./components/feature-showcase";

export const metadata: Metadata = {
  title: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
  description: "Diyetisyenler için profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim. 7 gün ücretsiz deneme ile başlayın. Zamandan tasarruf edin, gelirinizi artırın.",
  keywords: [
    "diyetisyen",
    "diyetisyen yazılımı",
    "diyetisyen yönetim sistemi",
    "danışan yönetimi",
    "diyet planı oluşturma",
    "beslenme danışmanlığı yazılımı",
    "diyetisyen platformu",
    "ücretsiz deneme",
    "diyetisyen uygulaması",
    "beslenme uzmanı yazılımı",
    "diyetisyen programı",
    "beslenme danışmanlığı platformu",
    "diyetisyen ofis yazılımı",
    "beslenme takip programı",
    "diyetisyen randevu sistemi",
    "beslenme planı yazılımı",
    "diyetisyen hasta takip sistemi",
    "beslenme uzmanı programı",
    "diyetisyen kliniği yazılımı",
    "beslenme danışmanı platformu",
    "diyetisyen pratik yazılımı",
    "beslenme takip uygulaması",
    "diyetisyen online platform",
    "beslenme uzmanı uygulaması",
    "diyetisyen yazılımı Türkiye",
    "beslenme danışmanlığı sistemi",
    "diyetisyen yönetim programı",
    "beslenme takip yazılımı",
    "diyetisyen CRM sistemi",
    "beslenme uzmanı CRM",
    "diyetisyen hasta yönetimi",
    "beslenme danışmanı takip sistemi",
    "diyetisyen pratik yönetimi",
    "beslenme uzmanı yönetim sistemi",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com",
    siteName: "DiyetKa",
    title: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim. 7 gün ücretsiz deneme.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. 7 gün ücretsiz deneme.",
    images: ["https://diyetka.com/og-image.png"],
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
      telephone: "+905379854487",
      contactType: "Müşteri Hizmetleri",
      areaServed: "TR",
      availableLanguage: "Turkish",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Giresun",
      addressCountry: "TR",
    },
    sameAs: [
      // Sosyal medya linkleri buraya eklenecek
    ],
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://diyetka.com",
      },
    ],
  };

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Diyetisyen Yönetim Platformu",
    description: "Diyetisyenler için kapsamlı danışan yönetim platformu. Diyet planları, ilerleme takibi, finansal yönetim ve daha fazlası.",
    provider: {
      "@type": "Organization",
      name: "DiyetKa",
      url: "https://diyetka.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
    serviceType: "Software as a Service",
    offers: {
      "@type": "Offer",
      price: "299",
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: "https://diyetka.com/pricing",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <div className="space-y-0">
        {/* Hero Banner Section with Gradient */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5">
          <LightStarsBackground />
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span>Yeni Nesil Danışan Yönetimi</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
                    <span className="block text-black">Diyetisyenler İçin</span>
                    <div className="mt-2">
                      <AnimatedText />
                    </div>
                  </h1>
                </div>

                <div>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Danışanlarınızı profesyonelce yönetin, kişiselleştirilmiş diyet planları oluşturun ve işinizi bir üst seviyeye taşıyın. Modern, hızlı ve güvenli.
                  </p>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Link
                      href="https://app.diyetka.com/sign-in"
                      className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                      target="_blank"
                    >
                      Ücretsiz Başla
                    </Link>
                    <Link
                      href="/pricing"
                      className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border-2 border-primary/10 bg-background/50 backdrop-blur-sm px-8 text-lg font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      Fiyatları İncele
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm font-medium text-muted-foreground/80">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-green-500/10 text-green-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>7 Gün Ücretsiz</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-green-500/10 text-green-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Kredi Kartı Yok</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Banner Image */}
              <div className="relative hidden lg:block">
                <div>
                  <div className="relative">
                    {/* Decorative Elements behind image */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/20 bg-white/5 backdrop-blur-sm transition-transform duration-500 hover:scale-[1.01]">
                      <img
                        src="/image_banner.png"
                        alt="DiyetKa diyetisyen yönetim platformu arayüzü - Danışan yönetimi, diyet planları ve ilerleme takibi ekran görüntüsü"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                      {/* Glass overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Floating Badge 1 - Onaylı Sistem */}
                    <div className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Onaylı Sistem</div>
                          <div className="text-xs text-muted-foreground">Güvenli Altyapı</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badge 2 - Kolay Kullanım */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Kolay Kullanım</div>
                          <div className="text-xs text-muted-foreground">Basit Arayüz</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badge 3 - 7/24 Destek */}
                    <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">7/24 Destek</div>
                          <div className="text-xs text-muted-foreground">Müşteri Hizmetleri</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300">50+</div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground">Aktif Diyetisyen</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground">Yönetilen Danışan</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300">1000+</div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground">Oluşturulan Plan</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300">%96</div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground">Memnuniyet Oranı</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-1">
                  <span>Özellikler</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">Neden DiyetKa?</h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Diyetisyenler için tasarlanmış kapsamlı çözüm. İşinizi kolaylaştırın, zaman kazanın.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                emoji="👥"
                title="Danışan Yönetimi"
                description="Tüm danışanlarınızı tek yerden yönetin."
                index={0}
              />
              <FeatureCard
                emoji="📋"
                title="Diyet Planları"
                description="Detaylı diyet planları oluşturun ve paylaşın."
                index={1}
              />
              <FeatureCard
                emoji="📊"
                title="İlerleme Takibi"
                description="Görsel grafiklerle ilerlemeyi takip edin."
                index={2}
              />
              <FeatureCard
                emoji="💰"
                title="Finansal Yönetim"
                description="Gelir ve giderlerinizi kolayca takip edin."
                index={3}
              />
              <FeatureCard
                emoji="📝"
                title="Notlar & Dokümanlar"
                description="Notlar tutun, dokümanları güvenle saklayın."
                index={4}
              />
              <FeatureCard
                emoji="📈"
                title="İstatistikler"
                description="Detaylı raporlarla işinizi analiz edin."
                index={5}
              />
              <FeatureCard
                emoji="🍎"
                title="Besin Veritabanı"
                description="Binlerce besinin değerlerine erişin."
                index={6}
              />
              <FeatureCard
                emoji="🧮"
                title="Hesaplayıcılar"
                description="BMI, BMR, TDEE ve daha fazlasını hesaplayın."
                index={7}
              />
            </div>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <FeatureShowcase />

        {/* Health & Lifestyle Section */}
        <HealthLifestyleSection />

        {/* How It Works Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-muted/20 via-background to-primary/5 border-y border-border/50">
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
            <div className="relative z-10 space-y-12">
              <div>
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-2">
                    <span>Başlangıç</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Nasıl Çalışır?</h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    DiyetKa ile başlamak çok kolay. Sadece birkaç adımda profesyonel danışan yönetim sisteminiz hazır.
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="relative h-full text-center space-y-4 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-primary text-3xl font-bold mb-2">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Kayıt Olun</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Hemen kayıt olun ve hesabınızı oluşturun. Kredi kartı gerektirmez, sadece birkaç dakika sürer.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="relative h-full text-center space-y-4 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-primary text-3xl font-bold mb-2">
                      2
                    </div>
                    <h3 className="text-xl font-bold">Danışanlarınızı Ekleyin</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      İlk danışanınızı ekleyin ve detaylı bilgilerini kaydedin. Tüm bilgiler güvenli bir şekilde saklanır.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="relative h-full text-center space-y-4 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-primary text-3xl font-bold mb-2">
                      3
                    </div>
                    <h3 className="text-xl font-bold">Yönetmeye Başlayın</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Diyet planları oluşturun, ilerlemeleri takip edin, notlar tutun ve finansal kayıtlarınızı yönetin.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-center pt-8">
                  <Link
                    href="https://app.diyetka.com/sign-up"
                    className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                  >
                    Hemen Başlayın
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Trial & No Risk Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Risksiz Deneme</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                    7 Gün Ücretsiz Deneme
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Beğenmezseniz iptal edebilirsiniz. Kredi kartı ve ücret istemiyoruz.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-8">
                  <div className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">7 Gün Ücretsiz</h3>
                      <p className="text-sm text-muted-foreground">
                        Tüm özelliklere tam erişim. Hiçbir kısıtlama yok.
                      </p>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Kredi Kartı Yok</h3>
                      <p className="text-sm text-muted-foreground">
                        Başlamak için kredi kartı bilgisi istemiyoruz.
                      </p>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">İstediğiniz Zaman İptal</h3>
                      <p className="text-sm text-muted-foreground">
                        Beğenmezseniz tek tıkla iptal edebilirsiniz. Hiçbir soru sorulmaz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="https://app.diyetka.com/sign-up"
                    className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    Ücretsiz Denemeye Başla
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
