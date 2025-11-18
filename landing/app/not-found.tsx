import Link from "next/link";
import type { Metadata } from "next";
import { FadeInUp, ScaleOnHover } from "./components/animations";

export const metadata: Metadata = {
  title: "404 - Sayfa Bulunamadı",
  description: "Aradığınız sayfa bulunamadı. Ana sayfaya dönün veya menüden istediğiniz sayfaya gidin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <FadeInUp>
          <div className="space-y-4">
            <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold">Sayfa Bulunamadı</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya dönmek için aşağıdaki butona tıklayın.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScaleOnHover>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Ana Sayfaya Dön
                <span className="ml-2">→</span>
              </Link>
            </ScaleOnHover>
            <ScaleOnHover>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-background/80 backdrop-blur-sm px-8 text-base font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                İletişim
              </Link>
            </ScaleOnHover>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Link
              href="/"
              className="p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:shadow-lg transition-all text-sm font-medium hover:text-primary"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/pricing"
              className="p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:shadow-lg transition-all text-sm font-medium hover:text-primary"
            >
              Fiyatlandırma
            </Link>
            <Link
              href="/about"
              className="p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:shadow-lg transition-all text-sm font-medium hover:text-primary"
            >
              Hakkımızda
            </Link>
            <Link
              href="/faq"
              className="p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:shadow-lg transition-all text-sm font-medium hover:text-primary"
            >
              SSS
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}

