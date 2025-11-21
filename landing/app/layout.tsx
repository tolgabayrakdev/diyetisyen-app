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
    default: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
    template: "%s | DiyetKa",
  },
  description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim. 7 gün ücretsiz deneme ile başlayın.",
  keywords: [
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
    title: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiyetKa - Diyetisyenler için akıllı danışan yönetimi",
    description: "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu.",
    images: ["/og-image.jpg"],
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
