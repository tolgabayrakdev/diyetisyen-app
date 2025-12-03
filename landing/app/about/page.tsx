import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "DiyetKa hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz. Diyetisyenler için profesyonel yönetim platformu geliştiren ekibimiz hakkında.",
  keywords: [
    "diyetka hakkında",
    "diyetisyen yazılımı ekibi",
    "beslenme platformu",
    "diyetisyen çözümleri",
    "sağlık teknolojisi",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com/about",
    siteName: "DiyetKa",
    title: "Hakkımızda - DiyetKa",
    description: "DiyetKa hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz. Diyetisyenler için profesyonel yönetim platformu geliştiren ekibimiz hakkında.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa Hakkımızda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda - DiyetKa",
    description: "DiyetKa hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.",
    images: ["https://diyetka.com/og-image.png"],
  },
  alternates: {
    canonical: "https://diyetka.com/about",
  },
};

export default function About() {
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
        name: "Hakkımızda",
        item: "https://diyetka.com/about",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <div className="space-y-0">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Hakkımızda
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Misyonumuz
          </h2>
          <p>
            DiyetKa olarak, diyetisyenlerin işlerini kolaylaştırmak ve
            danışanlarına daha iyi hizmet vermelerini sağlamak için
            kapsamlı bir yönetim platformu sunuyoruz. Teknolojiyi kullanarak
            diyetisyenlik mesleğini dijitalleştiriyor ve profesyonellere
            zaman kazandırıyoruz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Vizyonumuz
          </h2>
          <p>
            Türkiye'deki tüm diyetisyenlerin tercih ettiği, güvenilir ve
            kullanıcı dostu bir platform olmak. Danışan memnuniyetini
            artırarak sağlıklı yaşam alanında öncü bir rol üstlenmek.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Değerlerimiz
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Güvenilirlik:</strong> Danışan verilerinin güvenliği
              bizim önceliğimizdir.
            </li>
            <li>
              <strong>Kullanıcı Dostu:</strong> Karmaşık işlemleri basit
              ve anlaşılır hale getiriyoruz.
            </li>
            <li>
              <strong>İnovasyon:</strong> Sürekli gelişen teknoloji ile
              platformumuzu güncelliyoruz.
            </li>
            <li>
              <strong>Destek:</strong> 7/24 danışan desteği ile yanınızdayız.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Hikayemiz
          </h2>
          <p>
            DiyetKa, diyetisyenlerin yaşadığı zorlukları gözlemleyerek
            başladı. Manuel dosya yönetimi, karmaşık diyet planları ve
            takip süreçleri profesyonellerin zamanını alıyordu. Bu sorunları
            çözmek için modern teknoloji kullanarak kapsamlı bir platform
            geliştirdik.
          </p>
          <p>
            Bugün, yüzlerce diyetisyen DiyetKa'yı kullanarak işlerini
            yönetiyor ve danışanlarına daha iyi hizmet veriyor. Biz de
            sürekli gelişerek platformumuzu daha da iyileştirmeye devam
            ediyoruz.
          </p>
        </section>
      </div>
      </div>
    </div>
    </>
  );
}
