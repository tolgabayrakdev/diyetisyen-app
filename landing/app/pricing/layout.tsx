import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description: "DiyetKa fiyatlandırma planları. Standard ve Pro planlar. Size uygun planı seçin ve hemen başlayın. 7 gün ücretsiz deneme ile tüm özellikleri test edin.",
  keywords: [
    "diyetisyen yazılımı fiyatları",
    "diyetisyen platformu fiyatlandırma",
    "beslenme yazılımı ücretleri",
    "diyetisyen yönetim sistemi fiyat",
    "diyetisyen abonelik planları",
    "beslenme danışmanlığı yazılımı fiyat",
    "standard plan",
    "pro plan",
    "diyetisyen yazılımı aylık fiyat",
    "diyetisyen yazılımı yıllık fiyat",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com/pricing",
    siteName: "DiyetKa",
    title: "Fiyatlandırma - DiyetKa",
    description: "DiyetKa fiyatlandırma planları. Standard ve Pro planlar. Size uygun planı seçin ve hemen başlayın. 7 gün ücretsiz deneme ile tüm özellikleri test edin.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa Fiyatlandırma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiyatlandırma - DiyetKa",
    description: "DiyetKa fiyatlandırma planları. Size uygun planı seçin ve hemen başlayın.",
    images: ["https://diyetka.com/og-image.png"],
  },
  alternates: {
    canonical: "https://diyetka.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

