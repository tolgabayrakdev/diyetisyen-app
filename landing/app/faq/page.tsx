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
    title: "Sık Sorulan Sorular - DiyetKa",
    description: "DiyetKa hakkında sık sorulan sorular ve cevapları.",
    url: "https://diyetka.com/faq",
  },
  alternates: {
    canonical: "https://diyetka.com/faq",
  },
};

export default function FAQ() {
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
          text: "Başlangıç planında 50, Profesyonel planında 200 danışan limiti vardır. Kurumsal planında sınırsız danışan ekleyebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Fiyatlandırmayı değiştirebilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur.",
        },
      },
      {
        "@type": "Question",
        name: "Destek nasıl sağlanıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Başlangıç planında e-posta desteği, Profesyonel planında öncelikli destek, Kurumsal planında ise 7/24 telefon desteği sunulmaktadır.",
        },
      },
      {
        "@type": "Question",
        name: "Diyet planı şablonları var mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, platformda hazır diyet planı şablonları bulunmaktadır. Bunları özelleştirerek kullanabilir veya sıfırdan oluşturabilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Verilerimi dışa aktarabilir miyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, tüm verilerinizi Excel veya PDF formatında dışa aktarabilirsiniz. Profesyonel ve Kurumsal planlarda API erişimi de mevcuttur.",
        },
      },
    ],
  };

  return (
    <>
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
