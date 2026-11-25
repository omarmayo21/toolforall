import type { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools-data";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(process.env.NEXT_PUBLIC_LAST_MODIFIED || "2026-11-25");
  const homeEntry: MetadataRoute.Sitemap = [{ url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 }];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/${c.key}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = ALL_TOOLS.map((t) => ({
    url: `${SITE_URL}/${t.category}/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: t.category === "unit-converters" ? 0.5 : 0.7,
  }));

  return [...homeEntry, ...categoryEntries, ...toolEntries];
}
