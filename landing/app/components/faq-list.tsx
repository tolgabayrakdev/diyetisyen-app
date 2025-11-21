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
      "Standard planında 100'e kadar danışan ekleyebilirsiniz. Pro planında ise sınırsız danışan ekleme imkanı vardır.",
  },
  {
    question: "Fiyatlandırmayı değiştirebilir miyim?",
    answer:
      "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Standard planı 299 TL/ay, Pro planı 399 TL/ay'dır. Değişiklikler bir sonraki fatura döneminde geçerli olur.",
  },
  {
    question: "Destek nasıl sağlanıyor?",
    answer:
      "Standard planında e-posta desteği sunulmaktadır. Pro planında ise öncelikli e-posta desteği mevcuttur.",
  },
  {
    question: "Verilerimi dışa aktarabilir miyim?",
    answer:
      "Evet, tüm verilerinizi Excel veya PDF formatında dışa aktarabilirsiniz. Pro planında API erişimi de mevcuttur.",
  },
  {
    question: "Diyet planları nasıl oluşturulur?",
    answer:
      "Platformda zengin metin editörü ile detaylı diyet planları oluşturabilirsiniz. PDF yükleyebilir, şablonlar kullanabilir veya sıfırdan plan oluşturabilirsiniz. Her plan danışana özel olarak hazırlanabilir.",
  },
  {
    question: "Danışan ilerlemelerini nasıl takip edebilirim?",
    answer:
      "Her danışan için kilo, vücut yağı, kas kütlesi gibi ölçümleri kaydedebilir ve görsel grafiklerle ilerlemeyi takip edebilirsiniz. PDF formatında ilerleme raporları oluşturabilirsiniz.",
  },
  {
    question: "Finansal kayıtları yönetebilir miyim?",
    answer:
      "Evet, gelir ve gider kayıtlarınızı tutabilir, ödeme geçmişini takip edebilirsiniz. Finansal raporları PDF olarak dışa aktarabilirsiniz.",
  },
  {
    question: "Danışan notları tutabilir miyim?",
    answer:
      "Evet, her danışan için özel notlar tutabilir, görüşme kayıtlarını saklayabilirsiniz. Notlarınız güvenli bir şekilde saklanır ve istediğiniz zaman düzenleyebilirsiniz.",
  },
  {
    question: "İstatistikler ve raporlar nasıl?",
    answer:
      "Platformda toplam danışan sayısı, aktif danışanlar, oluşturulan diyet planları, finansal özet gibi detaylı istatistikler bulunmaktadır. Tüm verilerinizi görsel grafiklerle analiz edebilirsiniz.",
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

