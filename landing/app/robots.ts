import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/si-gin", "/api/"],
      },
    ],
    sitemap: "https://diyetka.com/sitemap.xml",
  };
}

