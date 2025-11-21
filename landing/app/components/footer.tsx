import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background">
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">DiyetKa</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              DiyetKa - Diyetisyenler için akıllı danışan yönetimi. Danışanlarınızı kolayca
              yönetin, diyet planları oluşturun ve takip edin.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Ürün</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  SSS
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Yasal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-return"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Teslimat & İade
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">İletişim</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Bize Ulaşın
                </Link>
              </li>
              <li>Email: info@diyetka.com</li>
              <li>Tel: +90 (555) 123 45 67</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DiyetKa. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

