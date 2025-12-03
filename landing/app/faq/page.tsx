import type { Metadata } from "next";
import { FAQList } from "../components/faq-list";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description: "DiyetKa hakkında sık sorulan sorular ve cevapları. Diyetisyen yazılımı, fiyatlandırma, güvenlik, özellikler ve daha fazlası hakkında bilgi edinin.",
  keywords: [
    "diyetka sık sorulan sorular",
    "diyetisyen yazılımı sorular",
    "diyetisyen platformu SSS",
    "beslenme yazılımı sorular",
    "diyetisyen yönetim sistemi SSS",
    "diyetisyen yazılımı fiyatları",
    "diyetisyen platformu özellikleri",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com/faq",
    siteName: "DiyetKa",
    title: "Sık Sorulan Sorular - DiyetKa",
    description: "DiyetKa hakkında sık sorulan sorular ve cevapları. Diyetisyen yazılımı, fiyatlandırma, güvenlik, özellikler ve daha fazlası hakkında bilgi edinin.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa Sık Sorulan Sorular",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sık Sorulan Sorular - DiyetKa",
    description: "DiyetKa hakkında sık sorulan sorular ve cevapları.",
    images: ["https://diyetka.com/og-image.png"],
  },
  alternates: {
    canonical: "https://diyetka.com/faq",
  },
};

export default function FAQ() {
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Sık Sorulan Sorular",
        item: "https://diyetka.com/faq",
      },
    ],
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "DiyetKa'yı nasıl kullanmaya başlarım?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "İletişim sayfamızdan bizimle iletişime geçin veya doğrudan kayıt olun. 7 günlük ücretsiz deneme süresi ile tüm özellikleri test edebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Verilerim güvende mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, veri güvenliği bizim önceliğimizdir. Tüm veriler şifrelenmiş olarak saklanır ve KVKK uyumludur. Düzenli yedeklemeler yapılır.",
        },
      },
      {
        "@type": "Question",
        name: "Mobil uygulama var mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, DiyetKa tamamen mobil uyumludur. Web tarayıcınızdan herhangi bir cihazdan erişebilirsiniz. Yakında native mobil uygulamalar da gelecek.",
        },
      },
      {
        "@type": "Question",
        name: "Danışan sayısı limiti nedir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard planında 100'e kadar danışan ekleyebilirsiniz. Pro planında ise sınırsız danışan ekleme imkanı vardır.",
        },
      },
      {
        "@type": "Question",
        name: "Fiyatlandırmayı değiştirebilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Standard planı 299 TL/ay, Pro planı 399 TL/ay'dır. Değişiklikler bir sonraki fatura döneminde geçerli olur.",
        },
      },
      {
        "@type": "Question",
        name: "Destek nasıl sağlanıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard planında e-posta desteği sunulmaktadır. Pro planında ise öncelikli e-posta desteği mevcuttur.",
        },
      },
      {
        "@type": "Question",
        name: "Verilerimi dışa aktarabilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, tüm verilerinizi Excel veya PDF formatında dışa aktarabilirsiniz. Pro planında API erişimi de mevcuttur.",
        },
      },
      {
        "@type": "Question",
        name: "Diyet planları nasıl oluşturulur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Platformda zengin metin editörü ile detaylı diyet planları oluşturabilirsiniz. PDF yükleyebilir, şablonlar kullanabilir veya sıfırdan plan oluşturabilirsiniz. Her plan danışana özel olarak hazırlanabilir.",
        },
      },
      {
        "@type": "Question",
        name: "Danışan ilerlemelerini nasıl takip edebilirim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Her danışan için kilo, vücut yağı, kas kütlesi gibi ölçümleri kaydedebilir ve görsel grafiklerle ilerlemeyi takip edebilirsiniz. PDF formatında ilerleme raporları oluşturabilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Finansal kayıtları yönetebilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, gelir ve gider kayıtlarınızı tutabilir, ödeme geçmişini takip edebilirsiniz. Finansal raporları PDF olarak dışa aktarabilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Danışan notları tutabilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, her danışan için özel notlar tutabilir, görüşme kayıtlarını saklayabilirsiniz. Notlarınız güvenli bir şekilde saklanır ve istediğiniz zaman düzenleyebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "İstatistikler ve raporlar nasıl?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Platformda toplam danışan sayısı, aktif danışanlar, oluşturulan diyet planları, finansal özet gibi detaylı istatistikler bulunmaktadır. Tüm verilerinizi görsel grafiklerle analiz edebilirsiniz.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="space-y-0">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block mt-2 bg-linear-to-br from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Sık Sorulan Sorular
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              DiyetKa hakkında merak ettikleriniz için aşağıdaki sorulara göz
              atabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 max-w-3xl mx-auto">
        <FAQList />

      <div className="space-y-4 p-5 text-center bg-muted/50 rounded-lg">
        <h2 className="text-lg font-semibold">
          Sorunuzun cevabını bulamadınız mı?
        </h2>
        <p className="text-sm text-muted-foreground">
          Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
        </p>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          İletişime Geçin
        </Link>
      </div>
      </div>
      </div>
    </>
  );
}
