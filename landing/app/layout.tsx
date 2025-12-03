import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diyetka.com"),
  title: {
    default: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
    template: "%s | DiyetKa",
  },
  description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim. 7 gün ücretsiz deneme ile başlayın.",
  keywords: [
    "diyetisyen",
    "diyetisyen yazılımı",
    "diyetisyen yönetim sistemi",
    "diyet planı yazılımı",
    "danışan yönetimi",
    "diyetisyen platformu",
    "beslenme danışmanlığı yazılımı",
    "diyetisyen takip sistemi",
    "sağlıklı beslenme yazılımı",
    "diyetisyen işletme yazılımı",
    "beslenme uzmanı platformu",
    "diyetisyen dijital çözüm",
    "diyetisyen otomasyon",
    "beslenme danışmanı yazılımı",
    "diyetisyen CRM",
    "beslenme takip sistemi",
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
  authors: [{ name: "DiyetKa" }],
  creator: "DiyetKa",
  publisher: "DiyetKa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com",
    siteName: "DiyetKa",
    title: "DiyetKa - Yeni Nesil Danışan Yönetim Platformu",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim.",
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
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu.",
    images: ["https://diyetka.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "A6b2GxiL5iBDO3N7LY7eGK2b6zxQ3OhjlvE_tF3Erxc",
  },
  alternates: {
    canonical: "https://diyetka.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DiyetKa",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
                description: "7 gün ücretsiz deneme",
              },
              description: "Diyetisyenler için profesyonel yönetim platformu",
              url: "https://diyetka.com",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "127",
                bestRating: "5",
                worstRating: "1",
              },
              featureList: [
                "Danışan Yönetimi",
                "Diyet Planları Oluşturma",
                "İlerleme Takibi",
                "Finansal Yönetim",
                "Notlar ve Dokümanlar",
                "İstatistikler ve Raporlar",
                "Besin Veritabanı",
                "Hesaplayıcılar (BMI, BMR, TDEE)",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DiyetKa",
              url: "https://diyetka.com",
              description: "Diyetisyenler için profesyonel yönetim platformu",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://diyetka.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "DiyetKa",
              image: "https://diyetka.com/logo.png",
              "@id": "https://diyetka.com",
              url: "https://diyetka.com",
              telephone: "+905379854487",
              email: "diyetka@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Giresun",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 40.9128,
                longitude: 38.3895,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "17:00",
              },
              priceRange: "₺₺",
              servesCuisine: "Sağlık Teknolojisi",
            }),
          }}
        />
        <Header />
        <main className="min-h-screen" role="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
