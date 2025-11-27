"use client";

import { useState } from "react";

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "finansal",
    title: "Finansal Kayıtlar",
    description: "Tüm danışanlarınızın finansal kayıtlarını görüntüleyin ve yönetin. Toplam gelir, ödenen, bekleyen ve gecikmiş ödemeleri tek bakışta takip edin. PDF raporu oluşturma özelliği ile profesyonel raporlar hazırlayın.",
    image: "/features/finansal-kayit.png",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "ilerleme",
    title: "İlerleme Kayıtları",
    description: "Danışanlarınızın kilo, vücut yağı ve kas kütlesi değişimlerini görsel grafiklerle takip edin. Detaylı ilerleme raporları oluşturun ve danışanlarınızın motivasyonunu artırın.",
    image: "/features/ilerleme-kayit.png",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "hesaplayici",
    title: "Beslenme Hesaplayıcıları",
    description: "BMI, BMR, TDEE, makro besin, ideal kilo, su ihtiyacı ve protein ihtiyacı hesaplayıcıları ile profesyonel beslenme danışmanlığı yapın. Mifflin-St Jeor ve diğer formüllerle hassas hesaplamalar.",
    image: "/features/hesaplayicilar.png",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "besin",
    title: "Besin Veritabanı",
    description: "Kapsamlı besin veritabanı ile binlerce besinin kalori, protein, karbonhidrat ve yağ değerlerine anında erişin. Özel besinlerinizi ekleyin ve kategorize edin.",
    image: "/features/besin-veritabani.png",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

function LaptopMockup({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Laptop Frame */}
      <div className="relative">
        {/* Screen bezel */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-3 shadow-2xl">
          {/* Camera notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          </div>
          
          {/* Screen */}
          <div className="relative mt-3 rounded-lg overflow-hidden bg-white border border-gray-700">
            <img
              src={image}
              alt={title}
              className="w-full h-auto"
              loading="lazy"
            />
            {/* Screen glare effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {/* Laptop base/keyboard */}
        <div className="relative">
          {/* Hinge */}
          <div className="h-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm"></div>
          
          {/* Bottom part with trackpad area hint */}
          <div className="h-5 bg-gradient-to-b from-gray-800 to-gray-700 rounded-b-xl flex items-center justify-center">
            <div className="w-24 h-1.5 bg-gray-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Shadow under laptop */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/20 blur-xl rounded-full"></div>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id);
  const currentFeature = features.find((f) => f.id === activeFeature) || features[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Platform Önizleme</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Profesyonel Araçlar, <span className="text-primary">Modern Arayüz</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              DiyetKa'nın güçlü özelliklerini keşfedin. Her detay diyetisyenlerin ihtiyaçları düşünülerek tasarlandı.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-white/80 text-muted-foreground hover:bg-white hover:text-foreground border border-border/50 hover:border-primary/30"
                }`}
              >
                {feature.icon}
                <span>{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Laptop Display */}
          <div className="relative">
            <div className="transition-all duration-500 ease-out">
              <LaptopMockup
                image={currentFeature.image}
                title={currentFeature.title}
              />
            </div>
          </div>

          {/* Feature Description */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              {currentFeature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentFeature.description}
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-6 pt-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "border-primary/50 bg-primary/5 shadow-lg"
                    : "border-border/50 bg-white/50 hover:border-primary/30 hover:bg-white"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeFeature === feature.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

