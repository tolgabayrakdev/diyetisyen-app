"use client";

import { motion } from "framer-motion";
import { FadeInUp, StaggerContainer, StaggerItem } from "./animations";
import { FloatingParticles } from "./floating-particles";
import { AnimatedSectionBg } from "./animated-section-bg";
import { HealthLifestyleCard } from "./health-lifestyle-card";

const benefits = [
  {
    icon: "⏰",
    title: "Zamanınızı Kazanın",
    description: "Manuel dosya yönetimi ve kağıt işleri tarih olsun! Haftada 15+ saat kazanarak daha fazla danışana odaklanın.",
  },
  {
    icon: "💰",
    title: "Gelirinizi Artırın",
    description: "Otomatik faturalandırma ve ödeme takibi ile gelirlerinizi %40'a kadar artırın. Daha fazla danışan = daha fazla kazanç.",
  },
  {
    icon: "📋",
    title: "İşlerinizi Kolaylaştırın",
    description: "Hazır diyet planı şablonları, otomatik hatırlatmalar ve akıllı önerilerle iş yükünüzü %60 azaltın.",
  },
  {
    icon: "📊",
    title: "Profesyonel Görünün",
    description: "Görsel raporlar, grafikler ve analitiklerle danışanlarınıza profesyonel hizmet sunun. Güven ve itibar kazanın.",
  },
  {
    icon: "🔒",
    title: "Güvenli ve Güvenilir",
    description: "KVKK uyumlu, şifreli veri saklama. Danışan bilgileriniz %100 güvende. Yedekleme ve güvenlik bizim işimiz.",
  },
  {
    icon: "📱",
    title: "Her Yerden Erişin",
    description: "Mobil uyumlu platform ile ofis, ev veya seyahatte olsanız da danışanlarınıza anında erişin ve yönetin.",
  },
];

export function HealthLifestyleSection() {
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 overflow-hidden">
      <AnimatedSectionBg />
      <FloatingParticles />
      <div className="relative z-10 space-y-12">
        <FadeInUp>
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">Neden DiyetKa Kullanmalısınız?</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Diyetisyenler için özel olarak tasarlandı. İşinizi kolaylaştırın, zaman kazanın, gelirinizi artırın ve daha fazla danışana ulaşın.
            </p>
          </div>
        </FadeInUp>
        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <StaggerItem key={index}>
              <HealthLifestyleCard
                emoji={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                index={index}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}

