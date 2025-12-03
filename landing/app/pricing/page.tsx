"use client";

import Link from "next/link";
import { useState } from "react";
import { FadeInUp } from "../components/animations";

// Metadata için ayrı bir dosya oluşturmak yerine, burada client component olarak bırakıyoruz
// Next.js'te client component'lerde metadata export edilemez, bu yüzden layout'ta veya parent'ta olmalı

export default function Pricing() {
  const [duration, setDuration] = useState<"monthly" | "yearly">("monthly");

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
        name: "Fiyatlandırma",
        item: "https://diyetka.com/pricing",
      },
    ],
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "DiyetKa Diyetisyen Yönetim Platformu",
    description: "Diyetisyenler için profesyonel danışan yönetim platformu",
    brand: {
      "@type": "Brand",
      name: "DiyetKa",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Standard Plan",
        price: "299",
        priceCurrency: "TRY",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "TRY",
          unitCode: "MON",
        },
        availability: "https://schema.org/InStock",
        url: "https://diyetka.com/pricing",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "399",
        priceCurrency: "TRY",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "399",
          priceCurrency: "TRY",
          unitCode: "MON",
        },
        availability: "https://schema.org/InStock",
        url: "https://diyetka.com/pricing",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const plans = [
    {
      name: "Standard",
      monthly: {
        price: 299.0,
        originalPrice: null,
        clientLimit: 100,
      },
      yearly: {
        price: 2870.4,
        originalPrice: 3588.0,
        clientLimit: 100,
      },
      description: "Küçük ve orta ölçekli diyetisyen ofisleri için ideal",
      features: [
        "100'e kadar danışan",
        "Sınırsız diyet planı oluşturma",
        "Temel istatistikler ve raporlar",
        "E-posta desteği",
        "Mobil uyumlu arayüz",
        "Danışan takip sistemi",
      ],
      popular: false,
    },
    {
      name: "Pro",
      monthly: {
        price: 399.0,
        originalPrice: null,
        clientLimit: null, // Sınırsız
      },
      yearly: {
        price: 3830.4,
        originalPrice: 4788.0,
        clientLimit: null, // Sınırsız
      },
      description: "Büyüyen işletmeler ve profesyonel diyetisyenler için",
      features: [
        "Sınırsız danışan",
        "Sınırsız diyet planı oluşturma",
        "Gelişmiş istatistikler ve analitik",
        "Öncelikli e-posta desteği",
        "Mobil uyumlu arayüz",
        "Gelişmiş danışan takip sistemi",
        "Özel raporlar ve export",
        "API erişimi",
      ],
      popular: true,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <div className="space-y-0">
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block mt-2 text-primary">
                  Fiyatlandırma
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Size uygun planı seçin. İstediğiniz zaman yükseltebilir veya
                düşürebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 p-6 max-w-6xl mx-auto">
          {/* Toggle Switch */}
          <FadeInUp>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className={`text-sm font-medium transition-colors ${
                  duration === "monthly" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Aylık
              </span>
              <button
                type="button"
                onClick={() =>
                  setDuration(duration === "monthly" ? "yearly" : "monthly")
                }
                className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                role="switch"
                aria-checked={duration === "yearly"}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    duration === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${
                  duration === "yearly" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Yıllık
              </span>
              {/* Badge için sabit alan - layout kaymasını önlemek için */}
              <div className="w-[100px] flex justify-start">
                {duration === "yearly" && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
                    %20 İndirim
                  </span>
                )}
              </div>
            </div>
          </FadeInUp>

          {/* Plans Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {plans.map((plan) => {
              const currentPlan =
                duration === "monthly" ? plan.monthly : plan.yearly;
              const monthlyPrice =
                duration === "yearly"
                  ? (currentPlan.price / 12).toFixed(2)
                  : null;

              return (
                <FadeInUp key={plan.name} delay={plan.popular ? 0.1 : 0.2}>
                  <div
                    className={`relative space-y-6 p-6 rounded-xl ${
                      plan.popular
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                        : "border border-border hover:border-primary/50 transition-colors bg-card"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          En Popüler
                        </span>
                      </div>
                    )}

                    <div className="text-center space-y-3 pt-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="space-y-1">
                        {currentPlan.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {currentPlan.originalPrice.toFixed(2)}₺
                          </p>
                        )}
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-bold">
                            {currentPlan.price.toFixed(2)}₺
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{duration === "monthly" ? "ay" : "yıl"}
                          </span>
                        </div>
                        {monthlyPrice && (
                          <p className="text-xs text-muted-foreground">
                            Aylık: {monthlyPrice}₺
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="mr-2 text-primary text-base mt-0.5">
                            ✓
                          </span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div>
                      <Link
                        href="/contact"
                        className={`block w-full rounded-lg px-6 py-3 text-center text-base font-semibold transition-colors ${
                          plan.popular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                            : "border-2 border-primary/20 bg-background hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        Planı Seç
                      </Link>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
