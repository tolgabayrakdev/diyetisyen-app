import type { Metadata } from "next";
import { ContactForm } from "../components/contact-form";

export const metadata: Metadata = {
  title: "İletişim",
  description: "DiyetKa ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 7 gün ücretsiz deneme için başvurun.",
  keywords: [
    "diyetka iletişim",
    "diyetisyen yazılımı iletişim",
    "beslenme platformu destek",
    "diyetisyen yazılımı destek",
    "diyetka müşteri hizmetleri",
    "diyetisyen platformu iletişim",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com/contact",
    siteName: "DiyetKa",
    title: "İletişim - DiyetKa",
    description: "DiyetKa ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 7 gün ücretsiz deneme için başvurun.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa İletişim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim - DiyetKa",
    description: "DiyetKa ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin.",
    images: ["https://diyetka.com/og-image.png"],
  },
  alternates: {
    canonical: "https://diyetka.com/contact",
  },
};

export default function Contact() {
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
        name: "İletişim",
        item: "https://diyetka.com/contact",
      },
    ],
  };

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "DiyetKa İletişim",
    description: "DiyetKa ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "diyetka@gmail.com",
      telephone: "+90 5379854487",
      contactType: "Müşteri Hizmetleri",
      areaServed: "TR",
      availableLanguage: "Turkish",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />
      <div className="space-y-0">
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block mt-2 text-primary">
                  İletişim
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Sorularınız, önerileriniz veya destek talepleriniz için bizimle
                iletişime geçin. Size en kısa sürede dönüş yapacağız.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 max-w-3xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-3">İletişim Bilgileri</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">E-posta</p>
                    <p>
                      <a href="mailto:diyetka@gmail.com" className="text-primary hover:underline">
                        diyetka@gmail.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Telefon</p>
                    <p>
                      <a href="tel:+905379854487" className="text-primary hover:underline">
                        +90 5379854487
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Adres</p>
                    <address className="leading-relaxed not-italic">
                      Giresun, Türkiye
                      <br />
                      Çalışma Saatleri: Hafta içi <time>09:00</time>-<time>17:00</time>
                      <br />
                      Cumartesi-Pazar kapalı
                    </address>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
