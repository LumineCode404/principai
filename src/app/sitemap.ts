import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const SITE = "https://principai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.url.startsWith("/docs/principles/") ? 0.8 : 0.6,
  }));

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...pages,
  ];
}
