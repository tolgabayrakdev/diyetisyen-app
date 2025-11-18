"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "DiyetKa'yı nasıl kullanmaya başlarım?",
    answer:
      "İletişim sayfamızdan bizimle iletişime geçin veya doğrudan kayıt olun. 7 günlük ücretsiz deneme süresi ile tüm özellikleri test edebilirsiniz.",
  },
  {
    question: "Verilerim güvende mi?",
    answer:
      "Evet, veri güvenliği bizim önceliğimizdir. Tüm veriler şifrelenmiş olarak saklanır ve KVKK uyumludur. Düzenli yedeklemeler yapılır.",
  },
  {
    question: "Mobil uygulama var mı?",
    answer:
      "Evet, DiyetKa tamamen mobil uyumludur. Web tarayıcınızdan herhangi bir cihazdan erişebilirsiniz. Yakında native mobil uygulamalar da gelecek.",
  },
  {
    question: "Danışan sayısı limiti nedir?",
    answer:
      "Başlangıç planında 50, Profesyonel planında 200 danışan limiti vardır. Kurumsal planında sınırsız danışan ekleyebilirsiniz.",
  },
  {
    question: "Fiyatlandırmayı değiştirebilir miyim?",
    answer:
      "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur.",
  },
  {
    question: "Destek nasıl sağlanıyor?",
    answer:
      "Başlangıç planında e-posta desteği, Profesyonel planında öncelikli destek, Kurumsal planında ise 7/24 telefon desteği sunulmaktadır.",
  },
  {
    question: "Diyet planı şablonları var mı?",
    answer:
      "Evet, platformda hazır diyet planı şablonları bulunmaktadır. Bunları özelleştirerek kullanabilir veya sıfırdan oluşturabilirsiniz.",
  },
  {
    question: "Verilerimi dışa aktarabilir miyim?",
    answer:
      "Evet, tüm verilerinizi Excel veya PDF formatında dışa aktarabilirsiniz. Profesyonel ve Kurumsal planlarda API erişimi de mevcuttur.",
  },
];

export function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-border last:border-0">
          <button
            onClick={() => toggleFAQ(index)}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-md"
          >
            <span className="text-sm font-semibold pr-4">{faq.question}</span>
            <span className="text-lg text-muted-foreground flex-shrink-0">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

