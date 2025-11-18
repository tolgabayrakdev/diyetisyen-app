import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "DiyetKa kullanım şartları ve koşulları. Platform kullanımı, hesap sorumluluğu, ödeme ve faturalandırma koşulları hakkında detaylı bilgi.",
  keywords: [
    "diyetka kullanım şartları",
    "kullanım koşulları",
    "hizmet şartları",
    "platform kullanımı",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Kullanım Şartları - DiyetKa",
    description: "DiyetKa kullanım şartları ve koşulları.",
    url: "https://diyetka.com/terms",
  },
  alternates: {
    canonical: "https://diyetka.com/terms",
  },
};

export default function Terms() {
  return (
    <div className="space-y-0">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block mt-2 bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Kullanım Şartları
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
            1. Kabul
          </h2>
          <p>
            DiyetKa platformunu kullanarak, bu Kullanım Şartlarını kabul
            etmiş sayılırsınız. Şartları kabul etmiyorsanız, lütfen
            platformu kullanmayın.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Hesap Sorumluluğu
          </h2>
          <p>
            Hesabınızı oluştururken:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Doğru ve güncel bilgiler sağlamalısınız</li>
            <li>Hesap bilgilerinizi gizli tutmalısınız</li>
            <li>Hesabınızdaki tüm faaliyetlerden sorumlusunuz</li>
            <li>Şüpheli aktivite durumunda derhal bize bildirmelisiniz</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. Kullanım Kuralları
          </h2>
          <p>
            Platformu kullanırken:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Yasalara ve düzenlemelere uymalısınız</li>
            <li>Başkalarının haklarını ihlal etmemelisiniz</li>
            <li>Zararlı yazılım veya kod yüklememelisiniz</li>
            <li>Platformun güvenliğini tehdit edecek eylemlerde bulunmamalısınız</li>
            <li>Spam veya istenmeyen içerik göndermemelisiniz</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Fikri Mülkiyet
          </h2>
          <p>
            DiyetKa platformu ve içeriği telif hakkı ve diğer fikri mülkiyet
            yasaları ile korunmaktadır. Platform içeriğini izinsiz
            kopyalayamaz, dağıtamaz veya kullanamazsınız.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. Ödeme ve Faturalandırma
          </h2>
          <p>
            Ücretli planlar için:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Ödemeler önceden alınır</li>
            <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir</li>
            <li>İptal edilen hesaplar için geri ödeme yapılmaz</li>
            <li>Geç ödemeler hesabın askıya alınmasına neden olabilir</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. Hizmet Kesintileri
          </h2>
          <p>
            Platform bakım, güncelleme veya beklenmedik durumlar nedeniyle
            geçici olarak kesintiye uğrayabilir. Bu durumlardan sorumlu
            değiliz, ancak kesintileri en aza indirmek için çalışıyoruz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Hesap İptali
          </h2>
          <p>
            Hesabınızı istediğiniz zaman iptal edebilirsiniz. İptal
            işlemi, mevcut fatura döneminin sonunda geçerli olur. İptal
            edilen hesaplardaki veriler 30 gün sonra kalıcı olarak silinir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. Sorumluluk Reddi
          </h2>
          <p>
            Platform "olduğu gibi" sunulmaktadır. Hizmetlerin kesintisiz,
            hatasız veya güvenli olacağını garanti etmiyoruz. Platform
            kullanımından kaynaklanan zararlardan sorumlu değiliz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            9. Değişiklikler
          </h2>
          <p>
            Bu Kullanım Şartlarını istediğimiz zaman güncelleyebiliriz.
            Önemli değişiklikler e-posta ile bildirilir. Değişikliklerden
            sonra platformu kullanmaya devam etmeniz, güncellenmiş şartları
            kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            10. İletişim
          </h2>
          <p>
            Kullanım şartları hakkında sorularınız için{" "}
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
