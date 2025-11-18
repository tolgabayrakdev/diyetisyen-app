import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "DiyetKa gizlilik politikası ve kişisel verilerin korunması. KVKK uyumlu veri güvenliği ve gizlilik politikamız hakkında detaylı bilgi.",
  keywords: [
    "diyetka gizlilik politikası",
    "kvkk uyumlu",
    "veri güvenliği",
    "kişisel verilerin korunması",
    "gizlilik politikası",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Gizlilik Politikası - DiyetKa",
    description: "DiyetKa gizlilik politikası ve kişisel verilerin korunması.",
    url: "https://diyetka.com/privacy",
  },
  alternates: {
    canonical: "https://diyetka.com/privacy",
  },
};

export default function Privacy() {
  return (
    <div className="space-y-0">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Gizlilik Politikası
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
            1. Giriş
          </h2>
          <p>
            DiyetKa olarak, kullanıcılarımızın gizliliğini korumak bizim
            önceliğimizdir. Bu Gizlilik Politikası, DiyetKa platformunu
            kullanırken topladığımız bilgileri, bu bilgileri nasıl
            kullandığımızı ve paylaştığımızı açıklamaktadır.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Toplanan Bilgiler
          </h2>
          <p>
            Topladığımız bilgiler şunları içerir:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Hesap Bilgileri:</strong> Ad, soyad, e-posta adresi,
              telefon numarası
            </li>
            <li>
              <strong>Kullanım Bilgileri:</strong> Platform kullanım
              verileri, oturum bilgileri
            </li>
            <li>
              <strong>Danışan Verileri:</strong> Platform üzerinden
              kaydettiğiniz danışan bilgileri
            </li>
            <li>
              <strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü,
              cihaz bilgileri
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. Bilgilerin Kullanımı
          </h2>
          <p>
            Toplanan bilgileri şu amaçlarla kullanıyoruz:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Platform hizmetlerini sağlamak ve geliştirmek</li>
            <li>Danışan desteği sunmak</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
            <li>Yasal yükümlülükleri yerine getirmek</li>
            <li>İyileştirmeler yapmak için analiz</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Bilgilerin Paylaşımı
          </h2>
          <p>
            Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz, ancak
            aşağıdaki durumlar hariç:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Yasal zorunluluklar</li>
            <li>Hizmet sağlayıcılarımız (bulut hosting, ödeme işlemcileri)</li>
            <li>Kullanıcının açık rızası</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. Veri Güvenliği
          </h2>
          <p>
            Verilerinizin güvenliğini sağlamak için endüstri standardı
            şifreleme, güvenlik duvarları ve düzenli güvenlik denetimleri
            kullanıyoruz. Tüm veriler şifrelenmiş olarak saklanır ve
            aktarılır.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. KVKK Haklarınız
          </h2>
          <p>
            Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki
            haklara sahipsiniz:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen verileriniz hakkında bilgi talep etme</li>
            <li>Verilerinizin silinmesini veya düzeltilmesini isteme</li>
            <li>İşleme faaliyetlerine itiraz etme</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Çerezler
          </h2>
          <p>
            Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler
            kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. İletişim
          </h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için{" "}
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
