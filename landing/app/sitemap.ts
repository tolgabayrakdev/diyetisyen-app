import { MetadataRoute } from "next";
import { getBlogPostSlugs, getBlogPostBySlug, getBlogPostFileStats } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://diyetka.com";

  // Get all blog posts with file modification dates
  const blogSlugs = getBlogPostSlugs();
  const blogPosts = await Promise.all(
    blogSlugs.map(async (slug) => {
      const post = await getBlogPostBySlug(slug);
      const fileStats = getBlogPostFileStats(slug);
      
      // Use file modification date if available, otherwise use post date, otherwise use now
      let lastModified: Date;
      if (fileStats.exists) {
        lastModified = fileStats.mtime;
      } else if (post?.date) {
        lastModified = new Date(post.date);
      } else {
        lastModified = new Date();
      }
      
      return {
        slug,
        lastModified,
      };
    })
  );

  // Get the latest blog post date for blog listing page
  const latestBlogDate = blogPosts.length > 0
    ? new Date(Math.max(...blogPosts.map(p => p.lastModified.getTime())))
    : new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/delivery-return`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

