import type { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools-data";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";
import { allLangs, hreflangs, langsForTool, translatedTools } from "@/lib/i18n/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(process.env.NEXT_PUBLIC_LAST_MODIFIED || "2026-11-25");
  const alt = (path: string, langs: readonly string[]) => (langs.length ? { alternates: { languages: hreflangs(path, langs as never) } } : {});
  const entry = (url: string, changeFrequency: "daily" | "weekly" | "monthly", priority: number, path: string, langs: readonly string[]) => ({ url, lastModified: now, changeFrequency, priority, ...alt(path, langs) });

  const out: MetadataRoute.Sitemap = [entry(SITE_URL, "daily", 1, "/", allLangs)];
  for (const l of allLangs) out.push(entry(`${SITE_URL}/${l}`, "daily", 0.9, "/", allLangs));
  for (const pg of ["about", "privacy", "terms"]) out.push(entry(`${SITE_URL}/${pg}`, "monthly", 0.3, `/${pg}`, []));
  for (const c of CATEGORIES) {
    out.push(entry(`${SITE_URL}/${c.key}`, "weekly", 0.8, `/${c.key}`, allLangs));
    for (const l of allLangs) out.push(entry(`${SITE_URL}/${l}/${c.key}`, "weekly", 0.7, `/${c.key}`, allLangs));
  }
  for (const t of ALL_TOOLS) out.push(entry(`${SITE_URL}/${t.category}/${t.slug}`, "monthly", 0.7, `/${t.category}/${t.slug}`, langsForTool(t.slug)));
  for (const l of allLangs) for (const t of translatedTools(l)) out.push(entry(`${SITE_URL}/${l}/${t.category}/${t.slug}`, "monthly", 0.7, `/${t.category}/${t.slug}`, langsForTool(t.slug)));
  return out;
}
