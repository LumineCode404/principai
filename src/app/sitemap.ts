import type { MetadataRoute } from "next";
import { source, sourceId, sourceZh } from "@/lib/source";

const SITE = "https://principai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const toEntry = (
    url: string,
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  });

  const enPages = source.getPages().map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.url.startsWith("/docs/principles/") ? 0.8 : 0.6,
  }));

  const zhPages = sourceZh.getPages().map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.url.startsWith("/zh/docs/principles/") ? 0.7 : 0.5,
  }));

  const idPages = sourceId.getPages().map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.url.startsWith("/id/docs/principles/") ? 0.7 : 0.5,
  }));

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...enPages,
    ...zhPages,
    ...idPages,
    toEntry("/registry", 0.9),
    toEntry("/zh", 0.9),
    toEntry("/id", 0.9),
    toEntry("/llms.txt", 0.4),
  ];
}
