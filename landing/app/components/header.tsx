import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logo.png" 
            alt="DiyetKa Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <span className="text-xl font-bold text-primary">DiyetKa</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Hakkımızda
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Fiyatlandırma
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            SSS
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            İletişim
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://app.diyetka.com/sign-in"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </header>
  );
}

