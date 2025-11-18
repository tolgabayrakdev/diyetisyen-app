import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teslimat & İade",
  description: "DiyetKa teslimat ve iade politikası. Dijital hizmet teslimatı, 14 gün iade garantisi ve iptal politikası hakkında bilgi.",
  keywords: [
    "diyetka iade politikası",
    "teslimat politikası",
    "iade garantisi",
    "iptal politikası",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Teslimat & İade - DiyetKa",
    description: "DiyetKa teslimat ve iade politikası.",
    url: "https://diyetka.com/delivery-return",
  },
  alternates: {
    canonical: "https://diyetka.com/delivery-return",
  },
};

export default function DeliveryReturn() {
  return (
    <div className="space-y-0">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block mt-2 text-primary">
                Teslimat & İade Politikası
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Son Güncelleme: {new Date().toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. Hizmet Teslimatı
          </h2>
          <p>
            DiyetKa bir yazılım hizmeti (SaaS) platformudur. Hizmetlerimiz
            dijital olarak sunulmaktadır:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Anında Erişim:</strong> Kayıt işleminizi tamamladıktan
              sonra platforma anında erişim sağlarsınız.
            </li>
            <li>
              <strong>E-posta Onayı:</strong> Hesap aktivasyonu için e-posta
              doğrulaması gereklidir.
            </li>
            <li>
              <strong>7/24 Erişim:</strong> Platforma internet bağlantısı
              olan herhangi bir cihazdan 7/24 erişebilirsiniz.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Ücretsiz Deneme
          </h2>
          <p>
            Tüm yeni kullanıcılar 14 günlük ücretsiz deneme süresine
            sahiptir. Bu süre boyunca tüm özellikleri test edebilirsiniz.
            Ücretsiz deneme süresi sonunda otomatik olarak ücretlendirme
            başlamaz, önce ödeme bilgilerinizi girmeniz gerekir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. İade Politikası
          </h2>
          <p>
            DiyetKa bir dijital hizmet olduğu için, aşağıdaki iade koşulları
            geçerlidir:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>14 Gün İade Garantisi:</strong> İlk ödemenizden
              itibaren 14 gün içinde memnun kalmazsanız, tam iade
              yapılır.
            </li>
            <li>
              <strong>İade Talebi:</strong> İade talebinizi{" "}
              <a
                href="/contact"
                className="text-primary hover:underline"
              >
                iletişim sayfamızdan
              </a>{" "}
              iletebilirsiniz.
            </li>
            <li>
              <strong>İade Süreci:</strong> İade talebiniz 5 iş günü içinde
              işleme alınır ve ödeme 10-14 iş günü içinde geri yapılır.
            </li>
            <li>
              <strong>Kısmi İade:</strong> Kullanılan dönem için ücret
              kesilir, kalan süre için iade yapılır.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. İptal Politikası
          </h2>
          <p>
            Aboneliğinizi istediğiniz zaman iptal edebilirsiniz:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Anında İptal:</strong> Hesap ayarlarınızdan aboneliğinizi
              anında iptal edebilirsiniz.
            </li>
            <li>
              <strong>Mevcut Dönem:</strong> İptal işlemi mevcut fatura
              döneminin sonunda geçerli olur.
            </li>
            <li>
              <strong>Veri Erişimi:</strong> İptal sonrası 30 gün boyunca
              verilerinize erişebilirsiniz.
            </li>
            <li>
              <strong>Veri Silme:</strong> 30 gün sonra tüm verileriniz
              kalıcı olarak silinir.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. Ödeme Yöntemleri
          </h2>
          <p>
            Aşağıdaki ödeme yöntemlerini kabul ediyoruz:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Kredi kartı (Visa, Mastercard, American Express)</li>
            <li>Banka kartı</li>
            <li>Banka havalesi (Kurumsal planlar için)</li>
          </ul>
          <p className="pt-2">
            Tüm ödemeler güvenli ödeme ağ geçitleri üzerinden işlenir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. Fiyat Değişiklikleri
          </h2>
          <p>
            Fiyat değişiklikleri önceden bildirilir. Mevcut aboneler için
            fiyat artışları bir sonraki yenileme döneminde geçerli olur.
            Fiyat artışından memnun kalmazsanız, aboneliğinizi iptal
            edebilirsiniz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Teknik Destek
          </h2>
          <p>
            Platform kullanımı ile ilgili teknik destek ücretsizdir. E-posta
            veya canlı destek üzerinden yardım alabilirsiniz. Destek
            saatleri planınıza göre değişiklik gösterir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. İletişim
          </h2>
          <p>
            Teslimat ve iade konularında sorularınız için{" "}
            <a
              href="/contact"
              className="text-primary hover:underline"
            >
              iletişim sayfamızdan
            </a>{" "}
            bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
