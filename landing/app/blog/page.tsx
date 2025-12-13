import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Diyetisyenler için güncel blog yazıları, ipuçları ve rehberler. Dijital dönüşüm, danışan yönetimi ve daha fazlası.",
  keywords: [
    "diyetisyen blog",
    "beslenme blog",
    "diyetisyen ipuçları",
    "danışan yönetimi",
    "dijital dönüşüm",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://diyetka.com/blog",
    siteName: "DiyetKa",
    title: "Blog - DiyetKa",
    description: "Diyetisyenler için güncel blog yazıları, ipuçları ve rehberler.",
    images: [
      {
        url: "https://diyetka.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiyetKa Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - DiyetKa",
    description: "Diyetisyenler için güncel blog yazıları, ipuçları ve rehberler.",
    images: ["https://diyetka.com/og-image.png"],
  },
  alternates: {
    canonical: "https://diyetka.com/blog",
  },
};

export default async function Blog() {
  const posts = await getAllBlogPosts();

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
        name: "Blog",
        item: "https://diyetka.com/blog",
      },
    ],
  };

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "DiyetKa Blog",
    description: "Diyetisyenler için güncel blog yazıları, ipuçları ve rehberler",
    url: "https://diyetka.com/blog",
    publisher: {
      "@type": "Organization",
      name: "DiyetKa",
      logo: {
        "@type": "ImageObject",
        url: "https://diyetka.com/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="space-y-0">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight overflow-visible">
                <span className="block bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent pb-2">
                  Blog
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Diyetisyenler için güncel yazılar, ipuçları ve rehberler
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz blog yazısı bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  {post.image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {post.author && (
                        <>
                          <span>•</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
