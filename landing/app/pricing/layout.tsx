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
    title: "Fiyatlandırma - DiyetKa",
    description: "DiyetKa fiyatlandırma planları. Size uygun planı seçin ve hemen başlayın.",
    url: "https://diyetka.com/pricing",
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

